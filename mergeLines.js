const {
  mergeWith,
  isArray,
  uniqWith,
  isEqual,
} = require('lodash')


const recursion = (arr) => {
  let res = arr.reduce((a,b) => {
    return mergeLines(a,b)
  }, arr)

  if(res.length < arr.length) {
    return recursion(res)
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

  /**
   * можно обьединить только если:
   *
   * 1 есть только в одной строке
   * 1 в каждой строке в том же ряду
   *
   * 0 0 0 0 0
   * 1 0 0 0 0
   *
   * 0 1 0 0 0
   * 0 1 0 0 0
   *
   */

  if (newToOld) {
    return mergeObjects(oldLine, newLine);
  }

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

  if (oldToNew) {
    return mergeObjects(newLine, oldLine);
  }

  return oldLine
}

const mergeLines = (oldLines, newLine) => {
  let result = [];
  if(Array.isArray(oldLines)) {
    oldLines.map(oldLine => {
      const rew = mergeWithMask(oldLine, newLine)
      if (rew.length) {
        rew.map(el => result.push(el))
      } else {
        result.push(rew)
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