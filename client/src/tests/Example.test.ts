import axios from 'axios';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Example } from '@/services/Example';
import type { Uuid } from '@playground/types/uuid';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Example class', () => {
  const exampleData = { id: '1' as Uuid, name: 'Test', description: 'Test description' };
  const newData = { id: '1' as Uuid, name: 'NewName', description: 'New Test description' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all examples', async () => {
    mockedAxios.get.mockResolvedValue({ data: [exampleData] });
    const examples = await Example.fetchAll();
    expect(examples).toEqual([exampleData]);
    expect(examples.every(example => example instanceof Example)).toBe(true);
  });

  it('should get an example by id', async () => {
    mockedAxios.get.mockResolvedValue({ data: exampleData });
    const example = await Example.get('1' as Uuid);
    expect(example).toEqual(exampleData);
    expect(example).toBeInstanceOf(Example);
  });

  it('should create a new example', async () => {
    mockedAxios.post.mockResolvedValue({ data: exampleData });
    const example = await Example.create({ name: 'Test', description: 'Test description' });
    expect(example).toEqual(exampleData);
    expect(example).toBeInstanceOf(Example);
  });

  it('should update an example', async () => {
    mockedAxios.put.mockResolvedValue({ data: exampleData });
    const example = await Example.update('1' as Uuid, { name: 'Updated', description: 'Updated description' });
    expect(example).toEqual(exampleData);
    expect(example).toBeInstanceOf(Example);
  });

  it('should delete an example', async () => {
    mockedAxios.delete.mockResolvedValue({});
    await Example.delete('1' as Uuid);
    expect(axios.delete).toHaveBeenCalledWith('/api/example/1');
  });

  it('should get instance example', async () => {
    mockedAxios.get.mockResolvedValue({ data: exampleData });
    const example = new Example(newData);
    const fetchedExample = await example.get();
    expect(fetchedExample).toEqual(exampleData);
    expect(fetchedExample).toBeInstanceOf(Example);
    expect(example).toEqual(exampleData);
    expect(example).toBeInstanceOf(Example);
  });

  it('should create instance example', async () => {
    mockedAxios.post.mockResolvedValue({ data: exampleData });
    const example = new Example({ name: 'Test', description: 'Test description' });
    const createdExample = await example.create();
    expect(createdExample).toEqual(exampleData);
    expect(createdExample).toBeInstanceOf(Example);
    expect(example.id).toBe('1');
    expect(example).toEqual(exampleData);
    expect(example).toBeInstanceOf(Example);
  });

  it('should update instance example', async () => {
    mockedAxios.put.mockResolvedValue({ data: exampleData });
    const example = new Example(exampleData);
    const updatedExample = await example.update();
    expect(updatedExample).toEqual(exampleData);
    expect(updatedExample).toBeInstanceOf(Example);
    expect(example).toEqual(exampleData);
    expect(example).toBeInstanceOf(Example);
  });

  it('should delete instance example', async () => {
    mockedAxios.delete.mockResolvedValue({});
    const example = new Example(exampleData);
    await example.delete();
    expect(axios.delete).toHaveBeenCalledWith('/api/example/1');
  });
});
