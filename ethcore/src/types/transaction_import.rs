// Copyright 2015, 2016 Ethcore (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

//! Transaction import result related types

use ipc::binary::{BinaryConvertError, BinaryConvertable};
use error::{TransactionError, Error};

#[derive(Debug, Clone, Copy, PartialEq)]
/// Represents the result of importing transaction.
pub enum TransactionImportResult {
	/// Transaction was imported to current queue.
	Current,
	/// Transaction was imported to future queue.
	Future
}

binary_fixed_size!(TransactionImportResult);

/// Api-level error for transaction import
#[derive(Debug, Clone, Binary)]
pub enum TransactionImportError {
	/// Transaction error
	Transaction(TransactionError),
	/// Other error
	Other(String),
}

impl From<Error> for TransactionImportError {
	fn from(e: Error) -> Self {
		match e {
			Error::Transaction(transaction_error) => TransactionImportError::Transaction(transaction_error),
			_ => TransactionImportError::Other(format!("other block import error: {:?}", e)),
		}
	}
}
