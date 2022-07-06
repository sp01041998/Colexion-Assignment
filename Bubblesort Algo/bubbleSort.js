// its aa comparision based sorting algorithm, In each pass we place bigger element at its correct position.
// Use a flag to make Sure that if array is sorted then no need to travel the whole array(It will imporve best case scenario time complexity)

function bubblesort(arr) {
  let k = arr.length;

  for (let i = 0; i < k - 1; i++) {
    let flag = true;

    for (let j = 0; j < k - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        flag = false;
      }
    }

    if (flag) {
      return arr;
    }
  }
  return arr;
}

console.log(bubblesort([4, 8, 10, 12, 15, 18, 35, 30]));
