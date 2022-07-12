import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

describe('Show user profile use case', () => {
  let showUserProfileUseCase: ShowUserProfileUseCase
  let usersRepositoryInMemory: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    usersRepositoryInMemory= new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    showUserProfileUseCase= new ShowUserProfileUseCase(usersRepositoryInMemory)
  })

  it('should be able to show user profile', async () => {
    const user = await createUserUseCase.execute({
      email: 'user-test@example.com.br',
      name: 'User test',
      password: 'UserPassword'
    })

    const profile = await showUserProfileUseCase.execute(user.id)

    expect(profile.id).toEqual(user.id)
    expect(user).toEqual(profile)
  })

  it('should not be able to show user profile', async () => {
    expect(async () => {

      await showUserProfileUseCase.execute('')
    }).rejects.toBeInstanceOf(AppError)

  })
})
