# Business Data Integration Demo (TypeScript)

Demo-projekti, joka simuloi oikeaa integraatiotyötä: CSV → validointi → mapping → business-säännöt → output + virheraportointi.

## 🔧 Tech
- Node.js + TypeScript
- Zod (schema validation)
- PapaParse (CSV read/write)
- Commander (CLI)

## 🚀 Run
```bash
npm install
npm run dev -- --input sample/input.csv
