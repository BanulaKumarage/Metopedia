const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
});

app.get("/health", async(req, res)=> {
  const health = await client.cluster.health();
  res.json(health);
})

app.post("/search", async (req, res, next) => {
  console.log("Request from frontent")
  console.log(req.body)
  const {phrase} = req.body;
  const result = await client.search({
    index: "metaphors",
    body: {
      size: 75,
      query: {
        bool: {
          should: [
            {
              match: { poem_name: { query: phrase, operator: "AND" } },
            },
            {
              match: { poet: { query: phrase, operator: "AND" } },
            },
            {
              match: { line: { query: phrase, operator: "AND" } },
            },
            {
              match: { metaphorical_terms: { query: phrase, operator: "AND" } },
            },
            {
              match: { source_domain: { query: phrase, operator: "AND" } },
            },
            {
              match: { target_domain: { query: phrase, operator: "AND" } },
            },
            {
              match: {
                "meaning.case_insensitive_and_inflections": {
                  query: phrase,
                },
              },
            },
          ],
        },
      },
      highlight: {
        fields: {
          poem_name: {},
          poet: {},
          line: {},
          metaphorical_terms: {},
          source_domain: {},
          target_domain: {},
          "meaning.case_insensitive_and_inflections": {},
        },
        pre_tags: "Typography>",
        post_tags: "</Typography>",
      },
    },
  });
  const modifiedHits = result.hits.hits.map((hit) => {
    const sourceKeys = Object.keys(hit._source);
    const highlightKeys = Object.keys(hit.highlight);

    sourceKeys.forEach((sourceKey) => {
      if (sourceKey === "meaning") {
        temp_sourceKey = "meaning.case_insensitive_and_inflections";
        if (highlightKeys.includes(temp_sourceKey)) {
          hit._source[sourceKey] = hit.highlight[temp_sourceKey][0];
        }
      } else if (highlightKeys.includes(sourceKey)) {
        hit._source[sourceKey] = hit.highlight[sourceKey][0];
      }
    });

    return hit;
  });

  const modifiedResult = {
    hits: modifiedHits,
  };
  console.log(modifiedResult)
  res.json(modifiedResult);
});

// app listen with port
app.listen(3001, () => console.log("App listening on http://localhost:3001"));
