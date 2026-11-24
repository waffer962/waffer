import java.util.Arrays;

/**
 * Demonstrates quick sort and merge sort using two integer arrays.
 *
 * @author mohammad jibreen
 * @version 1.0
 */
public class SortExample {

    /**
     * Creates a sorting example.
     */
    public SortExample() {
    }

    /**
     * Creates sample arrays, sorts them, and prints the results.
     *
     * @param args command-line arguments (not used)
     */
    public static void main(String[] args) {
        Integer[] array1 = {12, 13, 24, 10, 3, 6, 90, 70};
        int[] array2 = {2, 6, 3, 5, 1};

        quickSort(array1, 0, array1.length - 1);
        System.out.println(Arrays.toString(array1));

        mergeSort(array2, array2.length);
        System.out.println(Arrays.toString(array2));
    }

    /**
     * Sorts a section of an Integer array in ascending order using quick sort.
     *
     * @param arr the array to sort
     * @param low the index of the first element in the section
     * @param high the index of the last element in the section
     */
    public static void quickSort(Integer[] arr, int low, int high) {
        if (arr == null || arr.length == 0 || low >= high) {
            return;
        }

        int middle = low + (high - low) / 2;
        int pivot = arr[middle];
        int i = low;
        int j = high;

        while (i <= j) {
            while (arr[i] < pivot) {
                i++;
            }
            while (arr[j] > pivot) {
                j--;
            }
            if (i <= j) {
                swap(arr, i, j);
                i++;
                j--;
            }
        }

        if (low < j) {
            quickSort(arr, low, j);
        }
        if (high > i) {
            quickSort(arr, i, high);
        }
    }

    /**
     * Exchanges two elements in an Integer array.
     *
     * @param array the array containing the elements
     * @param x index of the first element
     * @param y index of the second element
     */
    public static void swap(Integer[] array, int x, int y) {
        int temp = array[x];
        array[x] = array[y];
        array[y] = temp;
    }

    /**
     * Sorts the first n elements of an integer array using merge sort.
     *
     * @param a the array to sort
     * @param n the number of elements to sort
     */
    public static void mergeSort(int[] a, int n) {
        if (n < 2) {
            return;
        }

        int mid = n / 2;
        int[] left = new int[mid];
        int[] right = new int[n - mid];

        for (int i = 0; i < mid; i++) {
            left[i] = a[i];
        }
        for (int i = mid; i < n; i++) {
            right[i - mid] = a[i];
        }

        mergeSort(left, mid);
        mergeSort(right, n - mid);
        merge(a, left, right, mid, n - mid);
    }

    /**
     * Combines two sorted subarrays into one sorted array.
     *
     * @param a the destination array
     * @param l the sorted left subarray
     * @param r the sorted right subarray
     * @param left the number of elements in the left subarray
     * @param right the number of elements in the right subarray
     */
    public static void merge(int[] a, int[] l, int[] r, int left, int right) {
        int i = 0;
        int j = 0;
        int k = 0;

        while (i < left && j < right) {
            if (l[i] <= r[j]) {
                a[k++] = l[i++];
            } else {
                a[k++] = r[j++];
            }
        }
        while (i < left) {
            a[k++] = l[i++];
        }
        while (j < right) {
            a[k++] = r[j++];
        }
    }

    /**
     * Checks whether an integer array is in ascending order.
     *
     * @param x the array to check
     * @return true if the array is sorted; false otherwise
     */
    private static boolean isSorted(int[] x) {
        for (int i = 0; i < x.length - 1; i++) {
            if (x[i] > x[i + 1]) {
                return false;
            }
        }
        return true;
    }
}
