const {
  mergeWith,
  isArray,
  uniqWith,
  isEqual,
} = require('lodash')

/**
 * Рекурсивно вызываем .reduce
 * @param arr
 * @param fn
 * @returns []
 */
const recursion = (arr, fn) => {
  const res = arr.reduce((curr, next) => fn(curr, next), arr);

  if (res.length < arr.length) {
    return recursion(res, fn);
  }

  return res;
};

/**
 * Спопсоб обьединения значений обьединяемых обьектов
 * @param objValue
 * @param srcValue
 * @returns {any[]|*[]}
 */
const customizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    if(srcValue.length === 0 || objValue.length === 0) return [];
    return Array.from(new Set(objValue.concat(srcValue)));
  }
};

/**
 * Сверяет поля двух обьектов, друг с другом
 * @param fieldA
 * @param fieldB
 * @returns {number|number}
 */
const compareFields = (fieldA, fieldB) => {
  if(fieldA.length === 0) return 0;
  if(fieldB.length === 0) return 1;
  const result = fieldB.every(val => fieldA.includes(val));
  return result ? 0 : 1;
};

/**
 * На основе сверки полей создает массив с 0 и 1,
 * где 1 отличие одного поля обьекта от другого
 * @param lineA
 * @param lineB
 * @returns {*[]}
 */
const getBitMask = (lineA, lineB) => {
  if (
    Object.keys(lineA).length
    !== Object.keys(lineB).length
  ) {
    throw Error('Objects are different');
  }
  const bitMask = [];
  for (const indx in lineA) {
    if (indx) {
      bitMask.push(compareFields(lineA[indx], lineB[indx]));
    }
  }

  return bitMask;
};

/**
 * Сравнивает массивы отличий одного обьекта от другого
 * @param maskA
 * @param maskB
 * @returns {boolean}
 */
const compareBitMasks = (maskA, maskB) => {
  if (!maskA.includes(0) && !maskB.includes(0)) {
    return false;
  }

  return maskA.toString() === maskB.toString();
};

/**
 * Принимает два обьекта и сливает 1 в другой или наоборот
 * @param oldLine
 * @param newLine
 * @returns {*[]|*}
 */
const mergeWithMask = (oldLine, newLine) => {
  const oldLineMask = getBitMask(newLine, oldLine);
  const newLineMask = getBitMask(oldLine, newLine);

  const newToOld = compareBitMasks(oldLineMask, newLineMask);
  const oldToNew = compareBitMasks(newLineMask, oldLineMask);

  if (
    newToOld
    && oldToNew
    && !oldLineMask.includes(1)
    && !newLineMask.includes(1)
  ) {
    return [oldLine, newLine];
  }

  if (
    !newToOld
    && !oldToNew
    && !oldLineMask.includes(1)
    && newLineMask.includes(1)
  ) {
    return mergeWith(newLine, oldLine, customizer);
  }

  if (
    newToOld
    && !oldToNew
    && !oldLineMask.includes(1)
    && newLineMask.includes(1)
  ) {
    return mergeWith(oldLine, newLine, customizer);
  }

  if (
    !newToOld
    && !oldToNew
    && oldLineMask.includes(1)
    && !newLineMask.includes(1)
  ) {
    return mergeWith(newLine, oldLine, customizer);
  }

  if (
    !newToOld
    && !oldToNew
    && oldLineMask.includes(1)
    && newLineMask.includes(1)
    && oldLineMask.indexOf(1)
    !== newLineMask.indexOf(1)
  ) {
    return [oldLine, newLine];
  }

  return oldLine;
};

/**
 * Обьединяет обьекты с новым
 * @param oldLines
 * @param newLine
 * @returns {*[]|*|Array}
 */
const mergeLines = (oldLines, newLine) => {
  let result = [];
  if (Array.isArray(oldLines)) {
    oldLines.forEach(oldLine => {
      const temp = mergeWithMask(oldLine, newLine);
      if (Array.isArray(temp)) {
        result = [...temp];
      } else {
        result.push(temp);
      }
    });
  } else {
    result = mergeWithMask(oldLines, newLine);
  }

  return uniqWith(result, isEqual);
};

module.exports = {
  recursion,
  mergeLines
}