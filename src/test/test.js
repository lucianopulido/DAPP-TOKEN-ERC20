//Llamada al contrato 'Main'
const Main = artifacts.require('Main')

contract("Main", accounts => {

    before(async () => {
        //Smart contract desplegado
        this.mainContract = await Main.deployed()
    })

    it('Funcion: getOwner()', async () => {
        console.log(accounts[0])
        let direccionOwner = await mainContract.getOwner.call()
        assert.equal(accounts[0], direccionOwner)
    });
})