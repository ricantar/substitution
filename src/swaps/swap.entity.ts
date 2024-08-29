import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Swap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chainId: string;

  @Column()
  buyToken: string;

  @Column()
  sellToken: string;

  @Column()
  buyAmount: string;

  @Column()
  sellAmount: string;

  @Column()
  transactionHash: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
