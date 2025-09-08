// folderStructure.cjs

const fs = require("fs");
const path = require("path");

// ✅ __dirname is already available in CommonJS
const ROOT_DIR = path.resolve(__dirname, ".."); // project root
const OUTPUT_DIR = path.join(ROOT_DIR, "common_scripts", "scripts_outputs");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "folder_structure.txt");

// Ensure output folder exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const excludeFileName = ["node_modules", "dist", ".git"];

function generateTree(dir, prefix = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  let result = "";
  items.forEach((item, index) => {
    if (excludeFileName.includes(item.name)) return; // ✅ ignore junk

    const isLast = index === items.length - 1;
    const pointer = isLast ? "└── " : "├── ";
    const nextPrefix = prefix + (isLast ? "    " : "│   ");
    const itemPath = path.join(dir, item.name);

    result += prefix + pointer + item.name + "\n";

    if (item.isDirectory()) {
      result += generateTree(itemPath, nextPrefix);
    }
  });

  return result;
}

const structure = path.basename(ROOT_DIR) + "/\n" + generateTree(ROOT_DIR);

fs.writeFileSync(OUTPUT_FILE, structure);

console.log(`✅ Folder structure saved to ${OUTPUT_FILE}`);
