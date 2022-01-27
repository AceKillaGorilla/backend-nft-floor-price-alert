CREATE TABLE collections (
    collection_id SERIAL PRIMARY KEY,
    collection_slug varchar(255) NOT NULL UNIQUE,
  	collection_name varchar(255) NOT NULL UNIQUE
);

CREATE TABLE floor_prices (
  	snapshot_id SERIAL PRIMARY KEY,
    collection_id INT,
    collection_slug varchar(255) NOT NULL,
  	snapshot_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	floor_price DECIMAL(4,2) NOT NULL,
   	FOREIGN KEY(collection_id) REFERENCES collections(collection_id)
);

CREATE TABLE notifications (
  	notification_id SERIAL PRIMARY KEY,
    collection_id INT,
    collection_slug varchar(255) NOT NULL,
  	notification_creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	set_price DECIMAL(4,2) NOT NULL,
  	notification_type varchar(15),
  	email varchar(255) NOT NULL,
   	FOREIGN KEY(collection_id) REFERENCES collections(collection_id)
);

INSERT INTO collections(collection_slug, collection_name)
VALUES 
	('azuki', 'Azuki'),
    ('phantabear', 'PhantaBear'),
    ('clonex', 'CLONE X - X TAKASHI MURAKAMI'),
    ('wulfz-official', 'Wulfz Official'),
    ('cryptobatz-by-ozzy-osbourne', 'CryptoBatz by Ozzy Osbourne'),
    ('c-01-official-collection', 'C-01 Official Collection'),
    ('sandbox', 'The Sandbox'),
    ('nft-worlds', 'NFT Worlds'),
    ('alpacadabraz', 'ALPACADABRAZ'),
    ('primeapeplanetpap', 'Prime Ape Planet PAP'),
    ('multiversevm', 'MultiverseVM'),
    ('xenoinfinity', 'XenoInfinity');