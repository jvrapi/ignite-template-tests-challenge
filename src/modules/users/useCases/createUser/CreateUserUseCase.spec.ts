import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import { CreateUserUseCase } from "./CreateUserUseCase"

describe('Create user use case', () => {
  let usersRepositoryInMemory: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to create a new user', async () => {

    const userCreated =  await createUserUseCase.execute({
        name: 'User test',
        email: 'user-test@example.com',
        password: 'UserTest'
      })

    expect(userCreated.id).toBeDefined()

  })

  it('should not be able to create a new user', async () => {
    expect(async () => {
       await createUserUseCase.execute({
        name: 'User test',
        email: 'user-test@example.com',
        password: 'UserTest'
      })

       await createUserUseCase.execute({
        name: 'User test',
        email: 'user-test@example.com',
        password: 'UserTest'
      })

    }).rejects.toBeInstanceOf(AppError)
  })
})
