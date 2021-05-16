import MathFunctions from "../testFunctions/mathFunctions.mjs"
let mathFunctions;
beforeEach(()=>{
    mathFunctions = new MathFunctions();
})
describe("MathFunction check",()=>{
    test("sum 1 + 2  should be equal 3",()=>{
        expect(mathFunctions.sum(1,2)).toBe(3);
    })

    test("substruction 15 - 4 should be equal 11",()=>{
        expect(mathFunctions.substract(15,4)).toBe(11);
    })

    test("multiply 5 * 4 should be equal 20",()=>{
        expect(mathFunctions.multiply(5,4)).toBe(20);
    })

    test("devide 20 / 4 should be equal 5",()=>{
        expect(mathFunctions.divide(20,4)).toBe(5);
    })

})



