const {
  mergeWith,
  isArray,
  uniqWith,
  isEqual,
} = require('lodash')


const recursion = (arr, fn) => {
  let res = arr.reduce((a,b) => {
    return fn(a,b)
  }, arr)

  if(res.length < arr.length) {
    return recursion(res, fn)
  }

  return res
}

const customizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    if(srcValue.length === 0 || objValue.length === 0) return [];
    return Array.from(new Set(objValue.concat(srcValue)));
  }
}

const mergeObjects = (objA, objB) => {
  return mergeWith(objA, objB, customizer);
}

const compareFields = (fieldA, fieldB) => {
  if(fieldA.length === 0) return 0;
  if(fieldB.length === 0) return 1;
  const result = fieldB.every(val => fieldA.includes(val));
  return result ? 0 : 1;
}

const getBitMask = (lineA, lineB) => {
  if(
    Object.keys(lineA).length
    !== Object.keys(lineB).length
  ) {
    throw Error('Objects are different')
  }
  let bitMask = [];
  for (let indx in lineA) {
    bitMask.push(compareFields(lineA[indx], lineB[indx]));
  }

  return bitMask;
}

const compareBitMasks = (maskA, maskB) => {
  if (!maskA.includes(0) && !maskB.includes(0)) {
    return false;
  }

  return maskA.toString() === maskB.toString();
}

const mergeWithMask = (oldLine, newLine) => {
  const oldLineMask = getBitMask(newLine, oldLine);
  const newLineMask = getBitMask(oldLine, newLine);

  let newToOld = compareBitMasks(oldLineMask, newLineMask);
  let oldToNew = compareBitMasks(newLineMask, oldLineMask);

  if(
    newToOld
    && oldToNew
    && !oldLineMask.includes(1)
    && !newLineMask.includes(1)
  ) {
    return [oldLine, newLine]
  }

  if(
    !newToOld
    && !oldToNew
    && !oldLineMask.includes(1)
    && newLineMask.includes(1)
  ) {
    return mergeObjects(newLine, oldLine)
  }

  if(
    newToOld
    && !oldToNew
    && !oldLineMask.includes(1)
    && newLineMask.includes(1)
  ) {
    return mergeObjects(oldLine, newLine)
  }

  if(
    !newToOld
    && !oldToNew
    && oldLineMask.includes(1)
    && !newLineMask.includes(1)
  ) {
    return mergeObjects(newLine, oldLine)
  }

  if(
    !newToOld
    && !oldToNew
    && oldLineMask.includes(1)
    && newLineMask.includes(1)
    && oldLineMask.indexOf(1)
    !== newLineMask.indexOf(1)
  ) {
    return [oldLine, newLine]
  }

  return oldLine
}

const mergeLines = (oldLines, newLine) => {
  let result = [];
  if(Array.isArray(oldLines)) {
    oldLines.map(oldLine => {
      const temp = mergeWithMask(oldLine, newLine)
      if (Array.isArray(temp)) {
        result = [...temp]
      } else {
        result.push(temp)
      }
    });
  } else {
    return result = mergeWithMask(oldLines, newLine)
  }

  return uniqWith(result, isEqual);
}

module.exports = {
  recursion,
  mergeLines
}