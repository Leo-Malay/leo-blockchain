const { SHA256 } = require("crypto-js");

class Block {
    constructor(blockId, timestamp, data, prevHash) {
        this.blockId = blockId;
        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.data = JSON.stringify(data);
        this.dataHash = SHA256(this.data).toString();
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    calculateHash() {
        return SHA256(
            [
                this.blockId,
                this.timestamp,
                this.prevHash,
                this.data,
                this.dataHash,
                this.nonce,
            ].join("@-#_$")
        ).toString();
    }
    mineBlock(key = 2) {
        while (this.hash.substring(0, key) !== Array(key + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(
            "[+] BlockId:",
            this.blockId,
            "Mined having nonce:",
            this.nonce
        );
        return {
            blockId: this.blockId,
            timestamp: this.timestamp,
            prevHash: this.prevHash,
            data: JSON.parse(this.data),
            hash: this.hash,
        };
    }
}

class BlockChain {
    constructor(difficulty = 2) {
        this.difficulty = difficulty;
        this.chain = [this.genesisBlock()];
        this.blockId = 0;
    }
    genesisBlock() {
        let block = new Block(0, "01/01/2022 00:00:00", {}, "0");
        return block.mineBlock(this.difficulty);
    }
    getLatestBlockHash() {
        return this.chain[this.blockId - 1].hash;
    }
    genTimeStamp() {
        let date = new Date();
        return [
            [date.getDate() + 1, date.getMonth() + 1, date.getFullYear()].join(
                "/"
            ),
            [
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds(),
            ].join(":"),
        ].join(" ");
    }
    addBlock(data) {
        this.blockId++;
        let block = new Block(
            this.blockId,
            this.genTimeStamp(),
            data,
            this.getLatestBlockHash()
        );
        this.chain.push(block.mineBlock(this.difficulty));
        return this.chain[this.blockId];
    }
    viewChain() {
        console.log(this.chain);
    }
}

const bc = new BlockChain(4);
console.log(bc.addBlock({ name: "Malay", age: 21 }));
console.log(bc.addBlock({ name: "Sally", age: 20 }));
console.log(bc.addBlock({ name: "John", age: 23 }));
