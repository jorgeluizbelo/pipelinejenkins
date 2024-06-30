/// <reference types="cypress" />

describe('Testes da Funcionalidade Usuários', () => {

  let token
  beforeEach(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => {
      token = tkn
    })
  });


  it('Deve validar contrato de usuarios', () => {
    cy.request('usuarios').then(response => {
        return contrato.validateAsync(response.body)
    })
});

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) => {
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  // Adicionado em commands
  let email = 'EBAC1' + Math.floor(Math.random() * 10000000)
  it('Deve cadastrar um usuário com sucesso', () => {
    cy.cadastrarUsuario('João', email, 'senha1')
  });

  it('Deve validar email invalido', () => {
    cy.cadastrarProduto(token, 'Email ebac 1', 250, "Descrição do usuario novo", 180)
      .then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Este email já está sendo usado')
      })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request({
      method: 'PUT',
      url: 'usuarios' + '/0uxuPY0cbmQhpEz1',
      headers: { authorization: token },
      body: {
        "nome": "Caio",
        "email": "beltrano1234@qa.com.br",
        "password": "teste",
        "administrador": "true"
      }
    }).should(response => {
      expect(response.body.message).to.equal('Registro alterado com sucesso')
      expect(response.status).to.equal(200)
    })
  });

  it('Deve deletar um usuario previamente cadastrado', () => {
    let usuarios = `usuario ebac ${Math.floor(Math.random() * 100000000)}`
    cy.cadastrarProduto(token, usuarios, 250, "Descrição do usuario novo", 180)
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,
          headers: { authorization: token }
        }).then(response => {
          expect(response.body.message).to.equal('Registro excluído com sucesso')
          expect(response.status).to.equal(200)
        })
      })
  });
});
