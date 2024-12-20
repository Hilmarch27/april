# april

## Hello, This is my first module to enhance the utility what you need

# Example

### JsonDownloader

```
function DataExportComponent() {
  const [userData, setUserData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
  ]);

  const handleExcelExport = () => {
    const excelBuffer = JsonDownloader.generateExcel(userData, {
      sheetName: 'User List',
      excludeColumns: ['id'],
      transformData: (user) => ({
        ...user,
        name: user.name.toUpperCase()
      }),
      headerMapping: {
        name: 'Full Name',
        email: 'Contact Email'
      }
    });

    // Additional logic to trigger file download
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCSVExport = () => {
    const csvContent = JsonDownloader.generateCSV(userData, {
      delimiter: ';',
      excludeColumns: ['id']
    });

    // Trigger CSV download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div>
      <button onClick={handleExcelExport}>Export to Excel</button>
      <button onClick={handleCSVExport}>Export to CSV</button>
    </div>
  );
}
```

### ExcelParser

```
// 1. Define Schema
const ProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  is_available: z.boolean()
});

type Product = z.infer<typeof ProductSchema>;

// 2. Configure Parser
const productParserOptions: ExcelParserOptions<Product> = {
  expectedHeaders: ['Product Name', 'Price', 'Stock', 'Available'],
  schema: ProductSchema,
  fieldMapping: {
    'Product Name': 'name',
    'Price': 'price',
    'Stock': 'stock',
    'Available': 'is_available'
  }
  transformations: {
  name: (value) => value.toLowerCase().trim(),
  Price: (value) => {
    const numPrice = Number(value);
    return isNaN(numPrice) ? null : numPrice;
    }
  }
};

// 3. Create Parser Instance
const productParser = new ExcelParser<Product>(productParserOptions);

// 4. Usage in React Component
function ProductUploader() {
  const handleFileUpload = async (file: File) => {
    try {
      const products = await productParser.parseExcel(file);
      // Process validated products
    } catch (error) {
      // Handle parsing errors
    }
  };

  return (
    <input
      type="file"
      accept=".xlsx,.xls"
      onChange={(e) => handleFileUpload(e.target.files[0])}
    />
  );
}
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
