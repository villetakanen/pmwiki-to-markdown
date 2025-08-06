// Let's trace through the first table step by step with the new logic
const firstTableData = `(:headnr:)Orm
(:head:)TAI
(:head:)VAI
(:head:)JOU
(:head:)URH
(:head:)NÄP
(:head:)SAL
(:head:)VEL
(:head:)VIE
(:head:)LOI
(:head:)VII
(:head:)Sisu
(:head:)Väki
(:head:)Satu
(:headnr:)Väringe / Onnensoturi
(:cell:)+2 
(:cell:)+1 
(:cell:)+1  
(:cell:)+1 
(:cell:)0  
(:cell:)-1 
(:cell:)+1 
(:cell:)0 
(:cell:)-2 
(:cell:)-1 
(:cell:)14	
(:cell:)0	
(:cell:)1
(:headnr:)HL
(:cell:)+3 
(:cell:)+2`;

const lines = firstTableData
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line);

const columnHeaders = [];
const dataRows = [];
let currentRowHeader = "";
let currentRowCells = [];
let hasSeenFirstCell = false;

console.log("=== Step by step processing ===");

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  console.log(`\nLine ${i}: "${line}"`);

  if (line.startsWith("(:headnr:)") || line.startsWith("(:head")) {
    const headerContent = line.replace(/^\(:head[^:]*:\)/, "").trim();

    if (!hasSeenFirstCell) {
      console.log(`  -> Adding to column headers: "${headerContent}"`);
      columnHeaders.push(headerContent);
    } else {
      console.log(
        `  -> Finishing previous row. Current row header: "${currentRowHeader}", cells: [${currentRowCells.join(", ")}]`,
      );
      if (currentRowHeader || currentRowCells.length > 0) {
        dataRows.push({
          rowHeader: currentRowHeader,
          cells: [...currentRowCells],
        });
      }
      console.log(`  -> Starting new row with header: "${headerContent}"`);
      currentRowHeader = headerContent;
      currentRowCells = [];
    }
  } else if (line.startsWith("(:cellnr:)") || line.startsWith("(:cell")) {
    if (!hasSeenFirstCell) {
      hasSeenFirstCell = true;
      console.log(
        "  -> First cell encountered! Transitioning from headers to data",
      );
      if (columnHeaders.length > 0) {
        const movedHeader = columnHeaders.pop();
        console.log(
          `  -> Moving last column header "${movedHeader}" to be row header`,
        );
        currentRowHeader = movedHeader || "";
      }
    }

    const cellContent = line.replace(/^\(:cell[^:]*:\)/, "").trim();
    console.log(`  -> Adding cell data: "${cellContent}"`);
    currentRowCells.push(cellContent);
  }
}

// Don't forget the last row
if (currentRowHeader || currentRowCells.length > 0) {
  console.log(
    `\nFinishing last row. Current row header: "${currentRowHeader}", cells: [${currentRowCells.join(", ")}]`,
  );
  dataRows.push({ rowHeader: currentRowHeader, cells: [...currentRowCells] });
}

console.log("\n=== Final result ===");
console.log("Column headers:", columnHeaders);
console.log("Data rows:", dataRows);
