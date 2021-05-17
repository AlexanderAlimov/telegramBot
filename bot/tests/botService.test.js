import BotService from "../servises/bot-service.mjs"
let botService
beforeEach(()=>{
    botService = new BotService({owner:"608717305", timezone: "Lvov"});
})

describe("Bot Service tests",() => {
   describe("authentication",() => {
        test("check password length", async () => {
            const password = "q"
            expect(await botService.auth(password)).toBe("Invalid password format. Please check it and try again");
        })

        test("check password is null", async () => {
            const password = null
            expect(await botService.auth(password)).toBe("Password is missed. Please check it and try again");
        })

        test("check if user is authenticated already", async () => {
            const fromId = "12345";
            expect(await botService.preAuthCheck(fromId)).toBe("Hello dear user, first You need to authorized. Please use /auth comand and enter your password.")
        })

        test("check sucsess  authenticated user ", async () => {
            const fromId = "608717305";
            expect(await botService.preAuthCheck(fromId)).toBe(null)
        })
   })

    

    describe("time parser", () => {
        test("check time parser, wrong hour and minute", () => {
            let stringTime = '25:90';
            expect(botService.timeParser(stringTime)).toEqual({minute:null,hour:null})
        })
    
        test("check time parser, correct hour and minute", () => {
            let stringTime = '21:10';
            expect(botService.timeParser(stringTime)).toEqual({minute:10,hour:21})
        })
    })

    describe("check possible commands service on listener", () => {
        test("check check greeting", async() => {
            let msg = {text: "hi"}
            expect(await botService.onListener(msg)).toBe("Hello dear user")
        })
    
        test("check good bye case", async() => {
            let msg = {text: "bye"}
            expect(await botService.onListener(msg)).toBe("Was very glad to hear you Dear user , Bye")
        })

        test("check Keyboard case", async() => {
            let msg = {text: "Keyboard"}
            expect(await botService.onListener(msg)).toBe("You just use keyboard")
        })
    })

    describe("check time zone services", () => {
        test("check get timezone", () => {
            expect(botService.getTimeZone()).toBe({timeZone: "Europe/Kiev"})
        })
    
        // test("check save time zone", () => {
        //     let msg = {text: "bye"}
        //     expect(botService.onListener(msg)).toBe("Was very glad to hear you Dear user , Bye")
        // })

        // test("check update timezone", () => {
        //     let msg = {text: "Keyboard"}
        //     expect(botService.onListener(msg)).toBe("You just use keyboard")
        // })
    })



})