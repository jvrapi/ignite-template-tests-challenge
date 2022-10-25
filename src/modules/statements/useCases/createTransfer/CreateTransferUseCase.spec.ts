import { OperationType } from "@modules/statements/entities/Statement"
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository"
import { CreateSTransferError } from "./CreateTransferError"
import { CreateTransferUseCase } from "./CreateTransferUseCase"

describe('Create transfer use case', () => {
  let createTransferUseCase: CreateTransferUseCase
  let usersRepositoryInMemory: IUsersRepository
  let statementsRepositoryInMemory: IStatementsRepository

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    createTransferUseCase = new CreateTransferUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
  })

  it('should be able to transfer a value between', async() => {

    const createStatement = jest.spyOn(statementsRepositoryInMemory, 'create')

    const sender = await usersRepositoryInMemory.create({
      email: 'hisucvok@uggikwaj.ls',
      name: 'David Sutton',
      password: '7M37yZWa'
    })

    const receiver = await usersRepositoryInMemory.create({
      email: 'liefituk@bi.eh',
      name: 'Dorothy Sims',
      password: 'a9iXYbqo'
    })

    await statementsRepositoryInMemory.create({
      amount: 2000,
      description: 'Deposito',
      type: OperationType.DEPOSIT,
      user_id: sender.id
    })

    await createTransferUseCase.execute({
      amount: 1000 ,
      description: 'Transferência de valor',
      receiver_id: receiver.id,
      sender_id: sender.id
    })

    expect(createStatement).toBeCalledTimes(3)

  })

  it('should not be able to make a transfer with invalid user', async () => {
    await expect (createTransferUseCase.execute({
      amount: 1000 ,
      description: 'Transferência de valor',
      receiver_id: '4b5a6c58-b435-4960-9bd8-c8979b85f7ff',
      sender_id: '413b472b-d9b1-4207-b908-981be8e622fa'
    })).rejects.toEqual(new CreateSTransferError.UserNotFound())
  })
})
