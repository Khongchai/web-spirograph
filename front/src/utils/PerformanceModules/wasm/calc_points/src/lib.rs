use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fractional_lcm(numbers: &[f64]) -> f64 {
    let mut longest_fractions: u32 = 0;

    for i in 0..numbers.len() {
        // Number not a decimal number.
        if numbers[i] % 1.0 == 0.0 {
            continue;
        };

        let num_string: String = numbers[i].to_string();
        let num_string_vec: Vec<&str> = num_string.split(".").collect();
        let fractions_count: u32 = num_string_vec[1].chars().count() as u32;

        longest_fractions = longest_fractions.max(fractions_count);
    }

    let power_of_ten = 10_u32.pow(longest_fractions) as f64;

    let gcd_of_decimal_numbers_as_ints = gcd(&numbers
        .iter()
        .map(|x| (x * power_of_ten).round())
        .collect::<Vec<f64>>());

    let result = power_of_ten / gcd_of_decimal_numbers_as_ints;

    result
}

fn gcd(numbers: &[f64]) -> f64 {
    let mut result = if numbers[0] <= 0.0 { 1.0 } else { numbers[0] };

    fn _gcd(mut a: f64, mut b: f64) -> f64 {
        while b > 0.0 {
            let tmp = b;
            b = a % b;
            a = tmp;
        }

        a
    }

    for i in 0..numbers.len() {
        result = _gcd(result, numbers[i]);
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn gcd_test() {
        let value1 = gcd(&[2.0, 4.0, 6.0]);
        let value2 = gcd(&[3.0, 10.0, 100.0]);
        let value3 = gcd(&[100.0, 200.0, 5.0]);
        let value4 = gcd(&[100.0, 510.0, 511.0, 200.0]);

        assert_eq!(value1, 2.0);
        assert_eq!(value2, 1.0);
        assert_eq!(value3, 5.0);
        assert_eq!(value4, 1.0);
    }

    #[test]
    fn fractional_lcm_test() {
        let value1: f64 = fractional_lcm(&[1.0, 5.1, 5.11, 2.0]);
        let value2: f64 = fractional_lcm(&[1.1, 20.5, 2.3, 6.0]);
        let value3: f64 = fractional_lcm(&[1.1, 1.12, 2.23, 1.0]);
        let value4: f64 = fractional_lcm(&[2.56, 3.41, 5.11]);

        //ToDO need more variety in the test cases.
        assert_eq!(value1, 100.0);
        assert_eq!(value2, 10.0);
        assert_eq!(value3, 100.0);
        assert_eq!(value4, 100.0);
    }
}
