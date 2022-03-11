package blockchain
import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"os"
	"time"
)
func NewChain(filename, receiver string) error {
	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	file.Close()
	db, err := sql.Open("sqlite3", filename)
	if err != nil {
		return err
	}
	defer db.Close()
	_, err = db.Exec(CREATE_TABLE)
	chain := &BlockChain{
		DB: db,
	}
	genesis := &Block{
		CurrHash:  []byte(GENESIS_BLOCK),
		PrevHash: []byte(GENESIS_BLOCK),
		Mapping:   make(map[string]uint64),
		Miner:     receiver,
		TimeStamp: time.Now().Format(time.RFC3339),
	}
	genesis.Mapping[STORAGE_CHAIN] = STORAGE_VALUE
	genesis.Mapping[receiver] = GENESIS_REWARD
	genesis.CurrHash = genesis.hash()
	chain.AddBlock(genesis)
	return nil
}
