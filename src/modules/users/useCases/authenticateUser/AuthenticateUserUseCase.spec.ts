import { AppError } from "@shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

describe('Authenticate User Use Case', () => {
  let usersRepositoryInMemory: InMemoryUsersRepository
  let authenticateUserUseCase: AuthenticateUserUseCase
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to authenticate user', async () => {
    const user: ICreateUserDTO = {
      email: 'user@test.com.br',
      name: 'User Test',
      password: '1234'
    }

    await createUserUseCase.execute(user)

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(userAuthenticated.token).toBeDefined()
  })

  it('should not be able to authenticate user', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: 'user@test.com.br',
        name: 'User Test',
        password: '1234'
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrong-password'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
