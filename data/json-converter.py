import csv
import json

csv_path = "corpus.csv"
json_path = "metaphores.json"

data = []
with open(csv_path, encoding="utf-8") as f:
    csv_reader = csv.DictReader(f)
    data.extend(
        {
            "poem_name": row["Poem name"],
            "poet": row["Poet"],
            "line": row["Line"],
            "metaphorical_terms": row["Metaphorical terms"],
            "source_domain": row["The source domain"],
            "target_domain": row["The target domain"],
            "meaning": row["Meaning"],
        }
        for row in csv_reader
        if row["Metaphor present or not"] == "yes"
    )
with open(json_path, "w", encoding="utf-8") as f:
    for row in data:
        json.dump({"index": {"_index": "metaphors"}}, f)
        f.write("\n")
        json.dump(row, f)
        f.write("\n")