import { Request, Response, NextFunction } from 'express';
import { generateRegistrationOptions, verifyRegistrationResponse, WebAuthnCredential } from '@simplewebauthn/server';
import { RegistrationResponseJSON } from "@simplewebauthn/typescript-types";
import { rpName, rpID, origin } from '../configs';
import { credentials, Credential } from '../models/Credential';
import { users } from '../models/User';
import { profiles } from '../models/Profile';
import { CustomError } from '../errors';

// See https://simplewebauthn.dev/docs/packages/server
export const handleRegisterStart = async (req: Request, res: Response, next: NextFunction) => {
    const {username} = req.body;

    if (!username) {
        return next(new CustomError('Username empty', 400));
    }

    let user = await users.getByUsername(username);
    let existingUserPasskeys: Credential[] = [];
    if (user) {
        existingUserPasskeys = await credentials.getAllByUserId(user.id);
    }

    try {
        const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
            rpName,
            rpID,
            userName: username,
            timeout: 60000,
            attestationType: 'direct',
            // attestationType: 'none',
            excludeCredentials: existingUserPasskeys.map(passkey => ({
                id: passkey.id,
                transports: passkey.transports,
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
            },
            // Support for the two most common algorithms: ES256, and RS256
            supportedAlgorithmIDs: [-7, -257],
        });

        req.session.loggedInUser = options.user;
        req.session.currentChallengeOptions = options;
        res.send(options);
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError('Internal Server Error' + error, 500));
    }
};

export const handleRegisterFinish = async (req: Request, res: Response, next: NextFunction) => {
    const {body} = req;
    
    if (!req.session.currentChallengeOptions) {
        return next(new CustomError('Current challenge is missing', 400));
    }

    if (!req.session.loggedInUser) {
        return next(new CustomError('User ID is missing', 400));
    }

    const currentChallengeOptions = req.session.currentChallengeOptions as PublicKeyCredentialCreationOptionsJSON;
    const currentChallenge = currentChallengeOptions.challenge;

    try {
        const verification = await verifyRegistrationResponse({
            response: body as RegistrationResponseJSON,
            expectedChallenge: currentChallenge,
            expectedOrigin: origin,
            expectedRPID: [rpID, "localhost"],
            requireUserVerification: false,
        });

        const { verified } = verification;
        const { registrationInfo } = verification;
        if (verified && registrationInfo) {
            const {
                credential,
                credentialDeviceType,
                credentialBackedUp,
            } = registrationInfo;

            const user = await users.add({
                id: req.session.loggedInUser.id,
                username: req.session.loggedInUser.name,
                email: req.session.loggedInUser.name + "@toplocs.com"
            });
            if (!user) {
                return next(new CustomError('User Create failed', 400));
            }

            const newPasskey = new Credential({
                id: credential.id,
                publicKey: Credential.uint8ArrayToBase64(credential.publicKey),
                userId: user.id,
                webauthnUserID: currentChallengeOptions.user.id,
                counter: credential.counter,
                deviceType: credentialDeviceType,
                transports: credential.transports,
                backedUp: credentialBackedUp,
            });
            const passkey = await credentials.add(newPasskey);

            if (!passkey) {
                return next(new CustomError('Credential Create failed', 400));
            }

            const profile = await profiles.add({
                userId: user.id,
                name: user.username,
                email: user.email
            });
            if (!profile) {
                return next(new CustomError('Profile Create failed', 400));
            }

            res.send({verified: true});
        } else {
            next(new CustomError('Verification failed', 400));
        }
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError('Internal Server Error', 500));
    } finally {
        req.session.loggedInUser = null;
        req.session.currentChallengeOptions = undefined;
    }
};