import fs from 'fs';
import dotenv from 'dotenv';

export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getEnv(
  name: string,
  defaultValue: string | undefined = undefined,
): string {
  const value = process.env[name];

  if (value !== undefined) {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Environment variable '${name}' not set`);
}

export function requireEnvironmentVariable(key: string): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Please ensure a value exists for ${key}`);
  }
  return value;
}

export function validateString<T extends string>(
  val: string,
  validValues: readonly string[],
): T {
  const res = validValues.indexOf(val);
  if (res < 0) {
    throw Error(`${val} is not one of ${validValues}`);
  }
  return val as T;
}

export function incrementTokenIdInEnv() {
  // Load the .env file
  const envConfig = dotenv.parse(fs.readFileSync('.env'));

  // Update the environment variable
  envConfig.TOKEN_ID = String(Number(envConfig.TOKEN_ID) + 1);

  // Read the original .env file and keep the comments
  const fileContent = fs.readFileSync('.env', 'utf8');
  const newFileContent = fileContent.split('\n')
    .map(line => {
      const [key, value] = line.split('=');
      if (envConfig.hasOwnProperty(key)) {
        return `${key}=${envConfig[key]}`;
      }
      return line;
    })
    .join('\n');

  // Write the updated configuration back to the .env file
  fs.writeFileSync('.env', newFileContent);
}