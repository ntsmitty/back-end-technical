const get_sum = require('./get_sum')
const string_to_decimal_length = require('./string_to_decimal_length')

const find_sub_lengths = (rush_numbers, roll_length, components) => {
    let sub_lengths = []
    let limit = get_sum(rush_numbers)


    const check = rush_numbers.length > 0 ? rush_numbers : sub_lengths;

    while (limit <= roll_length) {
        for (component of components) {
            const { size } = component
            if (string_to_decimal_length(size) + get_sum(check) <= roll_length) {
                sub_lengths.push(component)
            } 
        }
        limit++
    }
return sub_lengths;
}

module.exports = find_sub_lengths


// have to check for the half rugs 