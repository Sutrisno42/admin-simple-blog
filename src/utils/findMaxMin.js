
// terdapat object count
export function findMaxMinCount(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return { max: null, min: null };
    }
  
    return data.reduce(
      (acc, item) => {
        if (item.count > acc.max.count) acc.max = item;
        if (item.count < acc.min.count) acc.min = item;
        return acc;
      },
      { max: data[0], min: data[0] }
    );
  }
  