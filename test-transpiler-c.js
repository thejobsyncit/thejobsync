const cCode = `#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int* result = (int*)malloc(2 * sizeof(int));

    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                *returnSize = 2;
                return result;
            }
        }
    }

    *returnSize = 0;
    return NULL;
}`;

function transpile(userCode, language) {
  let jsCode = userCode;
  if (language === 'Java' || language === 'C++' || language === 'C') {
    jsCode = userCode
      // Remove class wrapper
      .replace(/public\s+class\s+\w+\s*\{/g, '')
      .replace(/class\s+\w+\s*\{/g, '')
      .replace(/\};\s*$/g, '')
      // Remove access modifiers
      .replace(/\b(?:public|private|protected|static|final|synchronized)\s+/g, '')
      .replace(/public:|private:|protected:/g, '')
      // Remove C/C++ includes and namespaces
      .replace(/#include\s*<[^>]+>\s*/g, '')
      .replace(/using\s+namespace\s+std;\s*/g, '')
      .replace(/std::/g, '')
      
      // C pointer assignments: *returnSize = 2 -> returnSize = 2
      .replace(/\*(\w+)\s*=/g, '$1 =')
      // (int*) typecasts
      .replace(/\(\s*(?:int\s*\*|int|long|double|float|char)\s*\)\s*/g, '')
      // sizeof
      .replace(/\bsizeof\s*\([^)]+\)/g, '1')

      // C++ Map -> JS Object
      .replace(/unordered_map\s*<[^>]*>\s+(\w+)\s*;/g, 'let $1 = {};')
      // C++ Vector -> JS Array
      .replace(/vector\s*<[^>]*>\s+(\w+)\s*;/g, 'let $1 = [];')
      // C++ Map find: numMap.find(comp) != numMap.end() -> numMap[comp] !== undefined
      .replace(/(\w+)\.find\(([^)]+)\)\s*!=\s*\1\.end\(\)/g, '$1[$2] !== undefined')
      // C++ Return vector initializer list: return {x, y}; -> return [x, y];
      .replace(/return\s+\{([^}]*)\}/g, 'return [$1]')
      .replace(/return\s+\{\}/g, 'return []')
      // HashMap methods
      .replace(/\.containsKey\(/g, '.has(')
      .replace(/\.containsValue\(/g, '.has(')
      .replace(/\.put\(/g, '.set(')
      .replace(/\.add\(([^)]+)\)/g, '.push($1)')
      .replace(/\.size\(\)/g, '.length')
      // Array initializers
      .replace(/new\s+int\[\]\s*\{([^}]*)\}/g, '[$1]')
      .replace(/new\s+int\[0\]/g, '[]')
      .replace(/new\s+int\[\s*(\w+)\s*\]/g, 'new Array($1).fill(0)')
      .replace(/new\s+Integer\[\]\s*\{([^}]*)\}/g, '[$1]')
      .replace(/new\s+String\[\]\s*\{([^}]*)\}/g, '[$1]')
      .replace(/new\s+boolean\[\]\s*\{([^}]*)\}/g, '[$1]')
      // STEP 1: Convert method signatures
      .replace(/(?:int\s*\*|vector\s*<[^>]*>|java\.util\.List\s*<[^>]*>|java\.util\.ArrayList\s*<[^>]*>|java\.util\.Map\s*<[^>]*>|int\[\]|String\[\]|boolean\[\]|double\[\]|long\[\]|char\[\]|List<[^>]*>|Map<[^>]*>|void)\s+(\w+)\s*\(([^)]*)\)\s*\{/g, (m, name, params) => {
        const cleanParams = params.replace(/(?:int\s*\*|vector\s*<[^>]*>&?|int\[\]|String\[\]|boolean\[\]|double\[\]|long\[\]|char\[\]|int|long|double|float|boolean|char|byte|short|String|Integer|Long|Double|Boolean)\s+(\w+)/g, '$1');
        return `function ${name}(${cleanParams}) {`;
      })
      .replace(/(?:int|long|double|float|boolean|char|byte|short|String|Integer|Long|Double|Boolean)\s+(\w+)\s*\(([^)]*)\)\s*\{/g, (m, name, params) => {
        const cleanParams = params.replace(/(?:int\s*\*|int\[\]|String\[\]|boolean\[\]|double\[\]|long\[\]|char\[\]|int|long|double|float|boolean|char|byte|short|String|Integer|Long|Double|Boolean)\s+(\w+)/g, '$1');
        return `function ${name}(${cleanParams}) {`;
      })
      // STEP 2: Strip type declarations from variable declarations
      .replace(/\b(?:int\s*\*|int\[\]|String\[\]|boolean\[\]|double\[\]|long\[\]|char\[\])\s+(\w+)(?=\s*[=;,)])/g, 'let $1')
      .replace(/\b(?:int|long|double|float|boolean|char|byte|short|String|Integer|Long|Double|Boolean)\s+(\w+)(?=\s*[=;,)])/g, 'let $1')
      // String conversions
      .replace(/Integer\.toString\(([^)]+)\)/g, 'String($1)')
      .replace(/String\.valueOf\(([^)]+)\)/g, 'String($1)')
      // @Override
      .replace(/@Override\s*/g, '')
      // C++ specifics
      .replace(/\bNULL\b/g, 'null')
      .replace(/\bnullptr\b/g, 'null')
      .replace(/System\.out\.println\(/g, 'console.log(')
      .replace(/System\.out\.print\(/g, 'console.log(');

    // Balance braces
    const openBraces = (jsCode.match(/\{/g) || []).length;
    const closeBraces = (jsCode.match(/\}/g) || []).length;
    if (closeBraces > openBraces) {
      jsCode = jsCode.replace(/\}\s*$/, '');
    }
  }
  return jsCode;
}

let js = transpile(cCode, 'C');
console.log('=== TRANSPILED C ===');
console.log(js);
console.log('=== RUNNING TEST ===');

let params = [[2, 7, 11, 15], 9];
let cParams = [];
for (let p of params) {
  cParams.push(p);
  if (Array.isArray(p)) {
    cParams.push(p.length);
  }
}
// Optional: what if the function uses returnSize?
cParams.push(0);

// Provide malloc in sandbox
function malloc() { return []; }

try {
  eval(js);
  const r1 = twoSum(...cParams);
  console.log("Result:", r1);
} catch(e) {
  console.error(e);
}
