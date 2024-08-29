import { IsString, IsNotEmpty, IsEthereumAddress, IsNumberString } from 'class-validator';

export class SwapDto {
  @IsString()
  @IsNotEmpty()
  chainId: string;

  @IsString()
  @IsNotEmpty()
  sellToken: string;

  @IsString()
  @IsNotEmpty()
  buyToken: string;

  @IsNumberString()
  @IsNotEmpty()
  sellAmount: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  privateKey: string;
}
