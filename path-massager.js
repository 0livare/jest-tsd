function convertPathsToTypeDefTest(...paths) {
  return paths.map((p) => {
    let testPath = p.replace(/.(test|spec).[jt]sx?$/, `.test-d.ts`);
    if (p.endsWith('x') && !testPath.endsWith('x')) testPath += 'x';
    return testPath;
  });
}

module.exports = { convertPathsToTypeDefTest };
