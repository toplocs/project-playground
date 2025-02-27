# Project Playground

Concepts that are considered here
- use pnpm and the pnpm workspaces
- Using types / interfaces for server and client
- Server loads sample data from json file
- Use services in client that implement an interface to handle a resource's api and lists
- Services are tested with jest
- Components for item and list respect their responsibilities. List handles list, item handles item.
- InPlace editing for updates

## HTTPS in dev mode

Run `pnpm dev:https`

### Generating Certificates using mkcert

`mkcert` is a simple tool for making locally-trusted development certificates. It requires no configuration.

Install `mkcert` on your system. You can find installation instructions on the [mkcert GitHub page](https://github.com/FiloSottile/mkcert).

1. **Install mkcert and create a local CA:**
    ```sh
    mkcert -install
    ```
    This command installs a local CA (Certificate Authority) in the system trust store.

2. **Generate a certificate for your local development domain:**
    ```sh
    mkcert localhost
    ```

3. **Use the generated certificates:**
    The certificates will be saved in the current directory with the names 
    `localhost.pem` and `localhost-key.pem`. You can use these files in your web server configuration.
