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

const pre_tag = '<strong><i>';
const post_tag = '</strong></i>';

app.get("/health", async (req, res) => {
  const health = await client.cluster.health();
  res.json(health);
});

// add a custom function
function getModifiedResponse(result) {
  try {
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

    return {
      hits: modifiedHits,
    };
  } catch {
    return {
      hits: [],
    };
  }
}

app.post("/author", async (req, res, next) => {
  console.log(`Request for  Mode: Author - ${req.body.phrase}`);
  const { phrase } = req.body;
  const result = await client.search({
    index: "metaphors",
    body: {
      size: 75,
      query: {
        bool: {
          should: [
            {
              match: { poet: { query: phrase } },
            },
          ],
        },
      },
      highlight: {
        fields: {
          poet: {},
        },
        pre_tags: pre_tag,
        post_tags: post_tag,
      },
    },
  });

  res.json(getModifiedResponse(result));
});

app.post("/poem", async (req, res, next) => {
  console.log(`Request for  Mode: Poem - ${req.body.phrase}`);
  const { phrase } = req.body;
  const result = await client.search({
    index: "metaphors",
    body: {
      size: 75,
      query: {
        bool: {
          should: [
            {
              match: { poem_name: { query: phrase } },
            },
          ],
        },
      },
      highlight: {
        fields: {
          poet: {},
        },
        pre_tags: pre_tag,
        post_tags: post_tag,
      },
    },
  });

  res.json(getModifiedResponse(result));
});

app.post("/source", async (req, res, next) => {
  console.log(`Request for  Mode: Source - ${req.body.phrase}`);
  const { phrase } = req.body;
  const result = await client.search({
    index: "metaphors",
    body: {
      size: 75,
      query: {
        bool: {
          should: [
            {
              match: { source_domain: { query: phrase } },
            },
          ],
        },
      },
      highlight: {
        fields: {
          source_domain: {},
        },
        pre_tags: pre_tag,
        post_tags: post_tag,
      },
    },
  });
  res.json(getModifiedResponse(result));
});

app.post("/target", async (req, res, next) => {
  console.log(`Request for  Mode: Target - ${req.body.phrase}`);
  const { phrase } = req.body;
  const result = await client.search({
    index: "metaphors",
    body: {
      size: 75,
      query: {
        bool: {
          should: [
            {
              match: { target_domain: { query: phrase } },
            },
          ],
        },
      },
      highlight: {
        fields: {
          target_domain: {},
        },
        pre_tags: pre_tag,
        post_tags: post_tag,
      },
    },
  });
  res.json(getModifiedResponse(result));
});

app.post("/meaning", async (req, res, next) => {
  console.log(`Request for  Mode: Meaning - ${req.body.phrase}`);
  const { phrase } = req.body;
  const result = await client.search({
    index: "metaphors",
    body: {
      size: 75,
      query: {
        bool: {
          should: [
            {
              match: {
                "meaning.case_insensitive_and_inflections": { query: phrase },
              },
            },
          ],
        },
      },
      highlight: {
        fields: {
          "meaning.case_insensitive_and_inflections": {},
        },
        pre_tags: pre_tag,
        post_tags: post_tag,
      },
    },
  });
  res.json(getModifiedResponse(result));
});

app.post("/advanced-search", async (req, res, next) => {
  console.log(`Request for  Mode: Advanced Search - ${req.body.phrase}`);
  const { phrase } = req.body;
  const result = await client.search({
    index: "metaphors",
    body: {
      size: 75,
      query: {
        "query_string": {
          "fields": [ "poem_name", "poet", "line", "metaphorical_terms", "source_domain", "target_domain", "meaning.case_insensitive_and_inflections"],
          "query": phrase
        }
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
        pre_tags: pre_tag,
        post_tags: post_tag,
      }
    }
  });
});

app.post("/search", async (req, res, next) => {
  console.log(`Request for  Mode: Search - ${req.body.phrase}`);
  const { phrase } = req.body;
  const result = await client.search({
    index: "metaphors",
    body: {
      size: 75,
      query: {
        "multi_match": {
          "query": phrase,
          "fields": [ "poem_name", "poet", "line", "metaphorical_terms", "source_domain", "target_domain", "meaning.case_insensitive_and_inflections"]
        }
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
        pre_tags: pre_tag,
        post_tags: post_tag,
      },
    },
  });
  res.json(getModifiedResponse(result));
});

// app listen with port
app.listen(3001, () => console.log("App listening on http://localhost:3001"));
