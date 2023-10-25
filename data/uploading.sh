#!/bin/sh

curl -X PUT "localhost:9200/metaphors?pretty" -H "Content-Type: application/json" -d @mapping.json
curl -X POST "localhost:9200/metaphors/_bulk?pretty" -H "Content-Type: application/json" --data-binary @metaphores.json