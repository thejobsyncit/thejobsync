const tsCode = `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }

        map.set(nums[i], i);
    }

    return [];
}`;

let jsCode = tsCode
  // Remove generic type arguments (e.g. <number, number>)
  .replace(/<\s*[a-zA-Z0-9_\[\]\s,]+\s*>/g, '')
  // Remove return types and variable types (e.g. : number[])
  .replace(/:\s*[a-zA-Z0-9_\[\]\s|]+/g, '')
  // Remove non-null assertion operator !
  .replace(/!\s*(?=[,)\}\];])/g, '');

console.log('=== JS CODE ===');
console.log(jsCode);

try {
  eval(jsCode);
  console.log("Compilation successful!");
} catch (e) {
  console.log("Compilation error:", e.message);
}
