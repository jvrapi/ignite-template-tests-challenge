import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

describe('Get balance use case', () => {
  let statementsRepository: InMemoryStatementsRepository
    let usersRepository: InMemoryUsersRepository
  let getBalanceUseCace: GetBalanceUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCace = new GetBalanceUseCase(statementsRepository, usersRepository)
  })


  it('should be able get balance', async () => {
    const user = await usersRepository.create({
      email: 'test@example.com.br',
      name: 'user test',
      password: 'some password'
     })

    const {balance, statement} = await getBalanceUseCace.execute({
      user_id: user.id
    })

    expect(balance).toBeDefined()
    expect(statement).toBeDefined()
  })

  it('should not be able to get balance', async () => {
    expect(async () => {
      await getBalanceUseCace.execute({
        user_id: ''
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
