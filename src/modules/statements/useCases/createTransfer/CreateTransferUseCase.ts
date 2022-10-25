import { OperationType } from "@modules/statements/entities/Statement";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject } from "tsyringe";
import { CreateSTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

class CreateTransferUseCase {
  constructor(
      @inject('UsersRepository')
      private usersRepository: IUsersRepository,
      @inject('StatementsRepository')
      private statementsRepository: IStatementsRepository
    ) { }
  async execute({amount, description, receiver_id, sender_id}: ICreateTransferDTO): Promise<void> {

    const receiver = await this.usersRepository.findById(receiver_id)
    const sender = await this.usersRepository.findById(sender_id)

    if(!receiver || !sender){
      throw new CreateSTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateSTransferError.InsufficientFunds()
    }

    // create a statement for user who sending the money

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id: sender_id,
      receiver_id
    })

    // create a statement for user who receives the money

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id: receiver_id,
    })
  }
}
export { CreateTransferUseCase };

