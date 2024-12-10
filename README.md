# april

## Hello, This is my first module to enhance the utility what you need

# Example

### logger

```
// Basic usage
logger.info('This is an info message');
logger.success('Operation completed');

// Configure globally
logger.configure({
  // Default levels for all environments
  enabledLevels: ['info', 'error'],

  // Environment-specific configurations
  environments: {
    development: {
      enabledLevels: ['info', 'success', 'warn', 'error', 'debug', 'verbose']
    },
    production: {
      enabledLevels: ['error', 'warn'], // Only critical logs
      disabled: false // Optional: completely disable logging
    },
    test: {
      enabledLevels: ['debug'] // Only debug logs in test
    }
  },

  // Optional transformer to modify log arguments
  transformer: (level, ...args) => {
    // Add timestamp or additional context
    return [`[${level.toUpperCase()}]`, ...args];
  }
});

// Set environment (optional, as it auto-detects from NODE_ENV)
logger.setEnvironment('development');
```

### AES

```
import { AES, type AESConfig } from "@hilmarch/april";

const config: AESConfig = {
  secretIV: "my secret key",
  secretKey: "my secret key",
};

const encrypted = AES.encrypt("hello world", config);
const decrypted = AES.decrypt(encrypted, config);
console.log(colors.green(encrypted));
console.log(colors.green(decrypted));

// output:
// encrypted: YWRkNjgzZjQxN2E0OWU4ZTc1YjZiMWRiYmZmMTc2MTA=
// decrypted: hello world
```

### JsonPretty

```
<!-- Membuat console berwarna -->
import { Csl } from '@hilmarch/april';

Csl.log('green', 'Console Green');
Csl.log('blue', 'Console Blue');
Csl.log('cyan', 'Console Cyan');
Csl.log('gray', 'Console Gray');
Csl.log('magenta', 'Console Magenta');
Csl.log('red', 'Console Red');
Csl.log('reset', 'Console Reset');
Csl.log('white', 'Console White');
Csl.log('yellow', 'Console Yellow');
```

```
import { JsonPretty } from '@hilmarch/april';

const data = {
  name: "John",
  age: 30,
  hobbies: ["reading", "gaming"],
  active: true,
};

// Format data dengan indentasi 4 spasi
const formatted = JsonPretty.format(data, { indent: 4 });
console.log(formatted);

// Format data dengan deskripsi tipe data
const formattedWithTypes = JsonPretty.format(data, { showDataType: true });
console.log(formattedWithTypes);

// Format data tanpa pewarnaan
const plainText = JsonPretty.format(data, { colorize: false });
console.log(plainText);
```

### Currency

```
import { Currency } from '@hilmarch/april';

console.log(Currency.rupiah(15000)); // "Rp 15.000"
console.log(Currency.rupiah("1234567")); // "Rp 1.234.567"
console.log(Currency.rupiah("12,345.67")); // "Rp 12.345,67"

console.log(Currency.deserialize("Rp 15.000,50")); // 15000.5
console.log(Currency.deserialize("1.234.567,89")); // 1234567.89
console.log(Currency.deserialize("0")); // 0

console.log(Currency.format(1234567.89)); // "Rp 1.234.567,89"
console.log(Currency.format("987654321", "$")); // "$ 987.654.321,00"
console.log(Currency.format(null)); // "Rp 0"

console.log(Currency.round(123.456)); // 123.46
console.log(Currency.round("987.654", 1)); // 987.7
console.log(Currency.round(null)); // 0

console.log(Currency.toWords(1000)); // "Seribu Rupiah"
console.log(Currency.toWords(12345)); // "Dua Belas Ribu Tiga Ratus Empat Puluh Lima Rupiah"
```

### Moment

```
import { Moment } from '@hilmarch/april';

console.log(Moment.formatDateId(new Date())); // "30-November-2024"
console.log(Moment.formatDateId("2024-11-01")); // "01-November-2024"

console.log(Moment.birthDate("1990-11-30")); // 34

console.log(Moment.formatDateTime(new Date())); // "2024-11-30 14:25:30"

console.log(Moment.differenceInDays("2024-11-30", "2024-11-25")); // -5

console.log(Moment.addDays("2024-11-30", 5)); // "2024-12-05"

console.log(Moment.subtractDays("2024-11-30", 5)); // "2024-11-25"

console.log(Moment.formatTime(new Date())); // "14:25:30"

console.log(Moment.toUTC(new Date())); // "2024-11-30T07:25:30.000Z"

console.log(Moment.period("2024-11-01","2024-11-30")); // false

```

### @hilmarch27
