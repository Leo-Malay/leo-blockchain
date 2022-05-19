# Leo-Blockchain

### Easy & Simple implementation of blockchian

Hello World here is my blockchain implementation which you can use anywhere without more effort weather t be a simple wallet project or a transaction project. I have made use of Crypto Library of NodeJS to generate "SHA256" for the blocks.

```jsx
// Import the module
const blockchain = require("leo-blockchain");
```

<br/>

Following are the functionality provided by the module.

<b>(1) Add a new Block to the chain</b>

```jsx
blockchain.addBlock(data); // datatype of "data" ---> JSON
```

<br/>

<b>(2) Set difficulty in Proof of work algorithm while mining</b>
<br/>[!Warning] It leads to creating a new chain. Loss of data may occour.

```jsx
blockchain.setDifficulty(difficulty); // difficulty belongs to range of 1 to 10
```

<br/>

<b>(3) Verify a random block with the given Id.</b>

```jsx
blockchain.verifyBlock(blockId); // returns boolean
```

<br/>

<b>(4) Verify entire chain.</b>

```jsx
blockchain.verifyChain(); // returns boolean
```

<br/>

<b>(5) Import Data.</b>
<br/>[!Warning] Import data only when the chain is empty or it wont accept forcing to reset.

```jsx
blockchain.importBlocks(fileName); // fileName without extension.
```

<br/>

<b>(6) Export Data.</b>

```jsx
blockchain.exportBlocks(fileName); // fileName without extension.
```

<br/>

<b>(7) Access chain</b>

```jsx
let block = blockchain.chain[blockId];
```

<i>This blockchain is not meant for professional use. There may be loophole. By no means I assure you that it will work like a charm. But I have tried my best to discover and fix all the loopholes</i>
