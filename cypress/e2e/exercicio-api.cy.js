/// <reference types="cypress" />
import contrato from '../contracts/produtos.contract'
import { faker } from '@faker-js/faker';



describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let email = faker.internet.email()
          let nome = faker.internet.userName()
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": nome,
                    "email": email,
                    "password": "teste",
                    "administrador": "true"
               }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.contain("Cadastro realizado com sucesso")
           })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "Fulano de Tal",
                    "email": "fulano@@email.com",
                    "password": "teste",
                    "administrador": "true"
               },
               failOnStatusCode: false
          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.contain("email deve ser um email válido")
           })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id
               cy.request({
                   method: 'PUT',
                   url: `usuarios/${id}`,
                   body:     {
                    "nome": "Fulano da Silva",
                    "email": "beltrano@qa.com.br",
                    "password": "teste",
                    "administrador": "true"
                  }
               }).then(response => {
                   expect(response.body.message).to.equal("Registro alterado com sucesso")
               })
           })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let email = faker.internet.email()
          let nome = faker.internet.userName()

          cy.cadastrarUsuario(nome, email, "teste", "true" )
          .then(response => {
              let id = response.body._id
              cy.request({
                  method: 'DELETE',
                  url: `usuarios/${id}`
              }).then(response =>{
                  expect(response.body.message).to.equal("Registro excluído com sucesso")
                  expect(response.status).to.equal(200)
              })
          })
     });


});
