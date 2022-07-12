import { OperationType } from "@modules/statements/entities/Statement"
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'

describe('Get Statement Operation', () => {
  let statementsRepository: InMemoryStatementsRepository
  let usersRepository: InMemoryUsersRepository
  let getStatementOperationUseCase: GetStatementOperationUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)
  })

  it('should be able to get statement operation use case', async () => {

    const user = await usersRepository.create({
      email: 'test@example.com.br',
      name: 'user test',
      password: 'some password'
     })


    const statement = await statementsRepository.create({
      amount: 5000,
      description: 'Some statement',
      type: 'deposit' as OperationType,
      user_id: user.id
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id,
      user_id: user.id
    })

    expect(statementOperation.id).toEqual(statement.id)
  })

  it('should not be able get statement operation with invalid user', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        email: 'test@example.com.br',
        name: 'user test',
        password: 'some password'
       })


      const statement = await statementsRepository.create({
        amount: 5000,
        description: 'Some statement',
        type: 'deposit' as OperationType,
        user_id: user.id
      })

       await getStatementOperationUseCase.execute({
        statement_id: statement.id,
        user_id: ''
      })

    }).rejects.toBeInstanceOf(AppError)
  })


  it('should not be able get statement operation with invalid statement', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        email: 'test@example.com.br',
        name: 'user test',
        password: 'some password'
       })


      const statement = await statementsRepository.create({
        amount: 5000,
        description: 'Some statement',
        type: 'deposit' as OperationType,
        user_id: user.id
      })

       await getStatementOperationUseCase.execute({
        statement_id: '',
        user_id: user.id
      })

    }).rejects.toBeInstanceOf(AppError)
  })
 })
