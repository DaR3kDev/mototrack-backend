import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentTypeDto } from './create-document-type.dto';

export class UpdateDocumentTypeDto extends PartialType(CreateDocumentTypeDto) {}
