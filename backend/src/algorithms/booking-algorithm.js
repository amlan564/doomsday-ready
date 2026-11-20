export const getOptimalBundleQuote = (bundleSizes, groupSize) => {
  const sortedSizes = [...bundleSizes].sort((a, b) => b - a);

  const dp = Array(groupSize + 1).fill(Infinity);
  const previousBundle = Array(groupSize + 1).fill(null);

  dp[0] = 0;

  for (let seats = 1; seats <= groupSize; seats++) {
    for (const size of sortedSizes) {
      if (size <= seats && dp[seats - size] + 1 < dp[seats]) {
        dp[seats] = dp[seats - size] + 1;
        previousBundle[seats] = size;
      }
    }
  }

  if (dp[groupSize] === Infinity) {
    return {
      possible: false,
      message: "Exact bundle combination is not possible",
    };
  }

  const bundleCounts = new Map();
  let remainingSeats = groupSize;

  while (remainingSeats > 0) {
    const size = previousBundle[remainingSeats];

    bundleCounts.set(size, (bundleCounts.get(size) || 0) + 1);

    remainingSeats -= size;
  }

  const bundles = [...bundleCounts.entries()]
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.size - a.size);

  return {
    possible: true,
    groupSize,
    totalBundles: dp[groupSize],
    bundles,
  };
};
