use anchor_lang::prelude::*;

declare mod_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Placeholder Program ID

#[program]
pub mod game_registry {
    use super::*;

    pub fn register_game(
        ctx: Context<RegisterGame>,
        game_id: String,
        title: String,
        fee_lamports: u64,
        developer_address: Pubkey,
    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.game_id = game_id;
        game.title = title;
        game.fee_lamports = fee_lamports;
        game.developer_address = developer_address;
        game.authority = ctx.accounts.authority.key();
        game.active = true; // Games are active by default upon registration
        Ok(())
    }

    // You might add update_game, deactivate_game, etc. later
}

#[derive(Accounts)]
#[instruction(game_id: String)]
pub struct RegisterGame<'info> {
    #[account(
        init,
        payer = authority,
        space = Game::LEN + 8, // 8 for Anchor's account discriminator
        seeds = [game_id.as_bytes()],
        bump
    )]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Game {
    pub game_id: String,
    pub title: String,
    pub fee_lamports: u64,
    pub developer_address: Pubkey,
    pub authority: Pubkey,
    pub active: bool,
}

impl Game {
    pub const LEN: usize = 
        32 + // game_id (Pubkey hash for unique identifier)
        32 + // title (String) -- need to figure out max size or use dynamic sized accounts
        8 +  // fee_lamports (u64)
        32 + // developer_address (Pubkey)
        32 + // authority (Pubkey)
        1;   // active (bool)

    // NOTE: For String fields, it's better to calculate exact space or use a max size for fixed accounts
    // For this MVP, we will assume reasonable string lengths or just pad.
    // A safer fixed size for String can be: 4 + MAX_LEN for its bytes.
    // Let's refine LEN to account for string length prefix + max chars

    pub const MAX_GAME_ID_LEN: usize = 32; // max bytes for a game ID string
    pub const MAX_TITLE_LEN: usize = 50; // max bytes for a title string

    // Recalculating LEN to be more realistic with string storage
    pub const REAL_LEN: usize = 
        (4 + Game::MAX_GAME_ID_LEN) + 
        (4 + Game::MAX_TITLE_LEN) + 
        8 +  // fee_lamports
        32 + // developer_address
        32 + // authority
        1;   // active
}
