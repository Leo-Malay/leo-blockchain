# Leo-Blockchain

### Easy & Simple implementation of blockchian

Hello World here is my blockchain implementation which you can use anywhere without more effort whether it be a simple wallet project or a transaction project. I have made use of Crypto Library of NodeJS to generate "SHA256" for the blocks.

```jsx
// Import the module
const blockchain = require("leo-blockchain");
```

<br/>

Following are the functionality provided by the module.

<b>(1) Perform Transaction</b>

```jsx
blockchain.addTransaction(data); // datatype of "data" ---> JSON
```

<b>(2) Search Transaction by transactionId</b>

```jsx
blockchain.searchTransaction(transactionId); // datatype of "transactionId" ---> Number
```

<b>(3) Set Difficulty</b>

```jsx
blockchain.addTransaction(difficulty); // datatype of "difficulty" ---> Number
```

<b>(4) Export your Chain</b>

```jsx
blockchain.exportBlocks("fileName.xyz");
```

<b>(5) Import your Chain</b>

```jsx
blockchain.importBlocks("fileName.xyz");
```

<br/>
<i>This blockchain is not meant for professional use. There may be loophole. By no means I assure you that it will work like a charm. But I have tried my best to discover and fix all the loopholes</i>
