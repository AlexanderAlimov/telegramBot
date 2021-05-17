import BotService from "../servises/bot-service.mjs"
let botService
beforeEach(()=>{
    botService = new BotService({owner:"608717305"});
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

    

})