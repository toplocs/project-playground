import { ExampleList } from '@/services/ExampleList';
import { Example } from '@/services/Example';
import type { Uuid } from '@playground/types/uuid';
import axios from 'axios';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExampleList service', () => {
  const exampleData = { id: '1' as Uuid, name: 'Test', description: 'Test description' };
  const newExampleData = { id: '2' as Uuid, name: 'New Example', description: 'New description' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all examples', async () => {
    mockedAxios.get.mockResolvedValue({ data: [exampleData] });
    const exampleList = new ExampleList();
    const examples = await exampleList.fetchAll();
    expect(examples).toEqual([exampleData]);
    expect(examples.every(example => example instanceof Example)).toBe(true);
  });

  it('should create a new example', async () => {
    mockedAxios.post.mockResolvedValue({ data: newExampleData });
    const exampleList = new ExampleList();
    const newExample = await exampleList.create({ name: 'New Example', description: 'New description' });
    expect(newExample).toEqual(newExampleData);
    expect(exampleList.items).toContainEqual(newExampleData);
  });

  it('should update an example', async () => {
    mockedAxios.put.mockResolvedValue({ data: exampleData });
    let example = new Example(exampleData);
    example.name = "Old Name";
    const exampleList = new ExampleList();
    exampleList.items = [example];
    example.name = exampleData.name;
    const updatedExample = await exampleList.update(example);
    expect(updatedExample).toEqual(exampleData);
  });

  it('should delete an example', async () => {
    mockedAxios.delete.mockResolvedValue({});
    const exampleList = new ExampleList();
    exampleList.items = [new Example(exampleData)];
    await exampleList.delete(exampleData.id);
    expect(exampleList.items).not.toContainEqual(exampleData);
  });
});
