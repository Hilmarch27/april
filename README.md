# april

## Hello This is my first module to enhance the utility what you need

# Example

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


### @hilmarch27
