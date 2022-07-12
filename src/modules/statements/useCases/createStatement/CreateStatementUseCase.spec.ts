import { OperationType } from "@modules/statements/entities/Statement"
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

describe('Create statement use case', () => {
    let statementsRepository: InMemoryStatementsRepository
    let usersRepository: InMemoryUsersRepository
    let createStatementUseCase: CreateStatementUseCase

    beforeEach(() => {
      usersRepository = new InMemoryUsersRepository()
      statementsRepository = new InMemoryStatementsRepository()
      createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
    })

    it('should be able to create a new statement', async () => {
       const user = await usersRepository.create({
        email: 'test@example.com.br',
        name: 'user test',
        password: 'some password'
       })

      const statement= await createStatementUseCase.execute({
        user_id: user.id,
        amount: 5000,
        description: 'Some description',
        type: 'deposit' as OperationType
       })

       expect(statement.id).toBeDefined()
    })

    it('should not be able to create a new statement', async () => {
      expect(async () => {
        const user = await usersRepository.create({
          email: 'test@example.com.br',
          name: 'user test',
          password: 'some password'
         })

         await createStatementUseCase.execute({
          user_id: user.id,
          amount: 5000,
          description: 'Some description',
          type: 'deposit' as OperationType
         })

        await createStatementUseCase.execute({
          user_id: user.id,
          amount: 6000,
          description: 'Some description',
          type: 'withdraw' as OperationType
        })
      }).rejects.toBeInstanceOf(AppError)
    })
})
