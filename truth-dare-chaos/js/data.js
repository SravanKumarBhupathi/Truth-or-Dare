/**
 * TRUTH × DARE: CHAOS MODE
 * Data Database (Truths, Dares, Events, etc.)
 */

const gameData = {
    truths: [
        // Innocent
        { id: 't1', type: 'truth', category: 'innocent', diff: 'easy', text: "What's the most embarrassing thing you've done in front of a crush?" },
        { id: 't2', type: 'truth', category: 'innocent', diff: 'easy', text: "What is your biggest fear?" },
        { id: 't3', type: 'truth', category: 'innocent', diff: 'easy', text: "Have you ever lied to get out of trouble? What was the lie?" },
        { id: 't4', type: 'truth', category: 'innocent', diff: 'easy', text: "What's the weirdest food combination you secretly enjoy?" },
        { id: 't5', type: 'truth', category: 'innocent', diff: 'easy', text: "Who was your first celebrity crush?" },
        { id: 't6', type: 'truth', category: 'innocent', diff: 'easy', text: "What is the most childish thing you still do?" },
        { id: 't7', type: 'truth', category: 'innocent', diff: 'easy', text: "Have you ever practiced kissing in a mirror?" },
        { id: 't8', type: 'truth', category: 'innocent', diff: 'easy', text: "What’s the longest you’ve gone without brushing your teeth?" },
        // Funny
        { id: 't9', type: 'truth', category: 'funny', diff: 'medium', text: "What is the dumbest way you’ve ever been injured?" },
        { id: 't10', type: 'truth', category: 'funny', diff: 'medium', text: "What’s a movie you cry at that you probably shouldn’t?" },
        { id: 't11', type: 'truth', category: 'funny', diff: 'medium', text: "Have you ever accidentally sent a text to the wrong person? What did it say?" },
        { id: 't12', type: 'truth', category: 'funny', diff: 'medium', text: "What's the most embarrassing nickname you've ever had?" },
        { id: 't13', type: 'truth', category: 'funny', diff: 'medium', text: "If you had to smell like one food for the rest of your life, what would it be?" },
        { id: 't14', type: 'truth', category: 'funny', diff: 'medium', text: "What’s the worst haircut you’ve ever had?" },
        { id: 't15', type: 'truth', category: 'funny', diff: 'medium', text: "Have you ever farted and blamed it on someone else?" },
        { id: 't16', type: 'truth', category: 'funny', diff: 'medium', text: "What is your most useless talent?" },
        // Deep
        { id: 't17', type: 'truth', category: 'deep', diff: 'hard', text: "What is a secret you’ve never told anyone in this room?" },
        { id: 't18', type: 'truth', category: 'deep', diff: 'hard', text: "When was the last time you cried and why?" },
        { id: 't19', type: 'truth', category: 'deep', diff: 'hard', text: "What is your biggest regret in life?" },
        { id: 't20', type: 'truth', category: 'deep', diff: 'hard', text: "If you died tomorrow, what would you wish you had done?" },
        { id: 't21', type: 'truth', category: 'deep', diff: 'hard', text: "What is a flaw you have that you are actively trying to fix?" },
        { id: 't22', type: 'truth', category: 'deep', diff: 'hard', text: "Who in this room do you think knows you the best?" },
        { id: 't23', type: 'truth', category: 'deep', diff: 'hard', text: "What's the hardest decision you've ever had to make?" },
        { id: 't24', type: 'truth', category: 'deep', diff: 'hard', text: "If you could change one thing about your past, what would it be?" },
        // Savage
        { id: 't25', type: 'truth', category: 'savage', diff: 'hard', text: "Who in this room is the worst dressed today?", requiresTarget: false },
        { id: 't26', type: 'truth', category: 'savage', diff: 'hard', text: "Who in this room would be the first to die in a zombie apocalypse?", requiresTarget: false },
        { id: 't27', type: 'truth', category: 'savage', diff: 'hard', text: "What is the most annoying habit of the person to your left?" },
        { id: 't28', type: 'truth', category: 'savage', diff: 'hard', text: "Who is the most hypocritical person you know?" },
        { id: 't29', type: 'truth', category: 'savage', diff: 'hard', text: "Rank the people in this room from most to least trustworthy." },
        { id: 't30', type: 'truth', category: 'savage', diff: 'hard', text: "Who do you think has the worst taste in music here?" },
        { id: 't31', type: 'truth', category: 'savage', diff: 'hard', text: "What is the biggest lie you've ever told to someone in this room?" },
        // Impossible / Insane
        { id: 't32', type: 'truth', category: 'impossible', diff: 'insane', text: "Show the room the last 3 photos in your camera roll." },
        { id: 't33', type: 'truth', category: 'impossible', diff: 'insane', text: "Read the last text message you sent out loud." },
        { id: 't34', type: 'truth', category: 'impossible', diff: 'insane', text: "Let the person to your right go through your search history for 30 seconds." },
        { id: 't35', type: 'truth', category: 'impossible', diff: 'insane', text: "What is the most illegal thing you have ever done?" },
        { id: 't36', type: 'truth', category: 'impossible', diff: 'insane', text: "Tell a secret about a friend that you promised not to tell." },
        { id: 't37', type: 'truth', category: 'impossible', diff: 'insane', text: "Who is the one person you would never want to be stranded on an island with?" },
        // Secret
        { id: 't38', type: 'truth', category: 'secret', diff: 'medium', text: "Do you have a hidden talent? Show us or tell us." },
        { id: 't39', type: 'truth', category: 'secret', diff: 'medium', text: "What is something you pretend to hate but secretly love?" },
        { id: 't40', type: 'truth', category: 'secret', diff: 'medium', text: "Have you ever snuck out of the house?" },
        { id: 't41', type: 'truth', category: 'secret', diff: 'medium', text: "What’s a weird habit you have when you're alone?" },
        { id: 't42', type: 'truth', category: 'secret', diff: 'hard', text: "Have you ever cheated on a test? How?" },
        { id: 't43', type: 'truth', category: 'secret', diff: 'hard', text: "What is a secret alias or fake name you’ve used online?" },
        // Relationship
        { id: 't44', type: 'truth', category: 'relationship', diff: 'hard', text: "Who is the most attractive person in this room?" },
        { id: 't45', type: 'truth', category: 'relationship', diff: 'hard', text: "Have you ever been rejected? How did it happen?" },
        { id: 't46', type: 'truth', category: 'relationship', diff: 'hard', text: "What’s the worst date you’ve ever been on?" },
        { id: 't47', type: 'truth', category: 'relationship', diff: 'medium', text: "What is your biggest turn-off?" },
        { id: 't48', type: 'truth', category: 'relationship', diff: 'medium', text: "Have you ever had a crush on a friend’s sibling?" },
        { id: 't49', type: 'truth', category: 'relationship', diff: 'hard', text: "Would you date anyone in this room?" },
        { id: 't50', type: 'truth', category: 'relationship', diff: 'insane', text: "Tell the room exactly what you look for in a partner, looking directly at someone." }
    ],
    // Dares will be added next...
    dares: [],
    chaosEvents: [],
    rewards: [],
    chains: [],
    battles: []
};

// Add Dares
gameData.dares = [
    // Funny
    { id: 'd1', type: 'dare', category: 'funny', diff: 'easy', text: "Do your best chicken dance outside for 10 seconds.", timer: 10 },
    { id: 'd2', type: 'dare', category: 'funny', diff: 'easy', text: "Speak in a fake accent for the next 3 rounds." },
    { id: 'd3', type: 'dare', category: 'funny', diff: 'easy', text: "Try to lick your elbow.", timer: 15 },
    { id: 'd4', type: 'dare', category: 'funny', diff: 'medium', text: "Let another player draw a mustache on your face with a pen (or use tape if no pen)." },
    { id: 'd5', type: 'dare', category: 'funny', diff: 'medium', text: "Talk without closing your mouth for the next round." },
    { id: 'd6', type: 'dare', category: 'funny', diff: 'medium', text: "Do a dramatic reading of a random text message.", timer: 30 },
    { id: 'd7', type: 'dare', category: 'funny', diff: 'hard', text: "Call a random business and ask if they have any spare 'left-handed' hammers.", timer: 60 },
    { id: 'd8', type: 'dare', category: 'funny', diff: 'hard', text: "Wear your clothes backwards for the rest of the game." },
    // Acting
    { id: 'd9', type: 'dare', category: 'acting', diff: 'medium', text: "Act like a monkey until it's your turn again." },
    { id: 'd10', type: 'dare', category: 'acting', diff: 'medium', text: "Pretend to be a waiter and take everyone's imaginary order.", timer: 30 },
    { id: 'd11', type: 'dare', category: 'acting', diff: 'hard', text: "Act out a famous movie scene. Everyone else has to guess the movie.", timer: 60 },
    { id: 'd12', type: 'dare', category: 'acting', diff: 'medium', text: "Pretend you are an alien discovering human objects for the first time.", timer: 30 },
    { id: 'd13', type: 'dare', category: 'acting', diff: 'hard', text: "Impersonate another player until someone guesses who it is." },
    { id: 'd14', type: 'dare', category: 'acting', diff: 'easy', text: "Act like a cat and rub against someone's leg." },
    { id: 'd15', type: 'dare', category: 'acting', diff: 'medium', text: "Pretend you are crying hysterically about something trivial.", timer: 20 },
    // Voice
    { id: 'd16', type: 'dare', category: 'voice', diff: 'easy', text: "Sing everything you say for the next 5 minutes." },
    { id: 'd17', type: 'dare', category: 'voice', diff: 'medium', text: "Call a friend and sing 'Happy Birthday' to them, even if it's not their birthday." },
    { id: 'd18', type: 'dare', category: 'voice', diff: 'easy', text: "Talk in a high-pitched voice until your next turn." },
    { id: 'd19', type: 'dare', category: 'voice', diff: 'medium', text: "Beatbox for 20 seconds straight.", timer: 20 },
    { id: 'd20', type: 'dare', category: 'voice', diff: 'hard', text: "Call someone and try to hold a conversation using only movie quotes.", timer: 60 },
    { id: 'd21', type: 'dare', category: 'voice', diff: 'medium', text: "Make the sound of a dial-up modem as accurately as you can." },
    // Skill
    { id: 'd22', type: 'dare', category: 'skill', diff: 'easy', text: "Balance a spoon on your nose for 10 seconds.", timer: 10 },
    { id: 'd23', type: 'dare', category: 'skill', diff: 'medium', text: "Do 20 pushups.", timer: 60 },
    { id: 'd24', type: 'dare', category: 'skill', diff: 'medium', text: "Say the alphabet backwards in 15 seconds.", timer: 15 },
    { id: 'd25', type: 'dare', category: 'skill', diff: 'hard', text: "Hold a plank for 1 minute.", timer: 60 },
    { id: 'd26', type: 'dare', category: 'skill', diff: 'medium', text: "Jumble a rubiks cube or tie a complex knot in 30 seconds." },
    { id: 'd27', type: 'dare', category: 'skill', diff: 'hard', text: "Stand on one leg with your eyes closed for 30 seconds.", timer: 30 },
    { id: 'd28', type: 'dare', category: 'skill', diff: 'medium', text: "Try to juggle 3 small objects." },
    // Chaos
    { id: 'd29', type: 'dare', category: 'chaos', diff: 'insane', text: "Let the person to your left text anyone in your contacts." },
    { id: 'd30', type: 'dare', category: 'chaos', diff: 'insane', text: "Swap a piece of clothing with the person to your right." },
    { id: 'd31', type: 'dare', category: 'chaos', diff: 'hard', text: "Mix 3 random edible liquids together and take a sip." },
    { id: 'd32', type: 'dare', category: 'chaos', diff: 'insane', text: "Let another player post a status on your social media." },
    { id: 'd33', type: 'dare', category: 'chaos', diff: 'hard', text: "Eat a raw slice of onion or lemon without making a face." },
    { id: 'd34', type: 'dare', category: 'chaos', diff: 'insane', text: "Call your mom or dad and tell them you're getting married tomorrow." },
    { id: 'd35', type: 'dare', category: 'chaos', diff: 'hard', text: "Let the group give you a new hairstyle using whatever is available." },
    { id: 'd36', type: 'dare', category: 'chaos', diff: 'insane', text: "Blindfold yourself and let someone feed you something from the fridge." },
    // Performance
    { id: 'd37', type: 'dare', category: 'performance', diff: 'medium', text: "Do a 30-second interpretive dance to no music.", timer: 30 },
    { id: 'd38', type: 'dare', category: 'performance', diff: 'hard', text: "Go outside and yell 'I believe in fairies!' loudly." },
    { id: 'd39', type: 'dare', category: 'performance', diff: 'medium', text: "Give a 1-minute motivational speech on a topic chosen by the group.", timer: 60 },
    { id: 'd40', type: 'dare', category: 'performance', diff: 'hard', text: "Do a runway walk across the room." },
    { id: 'd41', type: 'dare', category: 'performance', diff: 'medium', text: "Serenade the person to your right." },
    { id: 'd42', type: 'dare', category: 'performance', diff: 'hard', text: "Perform a magic trick (even if you don't know any)." },
    { id: 'd43', type: 'dare', category: 'performance', diff: 'medium', text: "Tell a 1-minute story using only animal noises.", timer: 60 },
    // Group
    { id: 'd44', type: 'dare', category: 'group', diff: 'medium', text: "Everyone must freeze. The first person to move loses 2 points.", groupDare: true },
    { id: 'd45', type: 'dare', category: 'group', diff: 'easy', text: "High five everyone in the room." },
    { id: 'd46', type: 'dare', category: 'group', diff: 'hard', text: "Create a human pyramid." },
    { id: 'd47', type: 'dare', category: 'group', diff: 'medium', text: "Everyone has to talk in a whisper for the next 3 rounds.", groupDare: true },
    { id: 'd48', type: 'dare', category: 'group', diff: 'easy', text: "Start a wave that goes around the room 3 times." },
    { id: 'd49', type: 'dare', category: 'group', diff: 'hard', text: "Everyone must switch seats in 5 seconds.", timer: 5, groupDare: true },
    { id: 'd50', type: 'dare', category: 'group', diff: 'medium', text: "Group hug for 10 seconds straight.", timer: 10, groupDare: true }
];

// Add Chaos Events
gameData.chaosEvents = [
    { id: 'c1', name: 'SWITCH', icon: '🔄', desc: 'Choose another player to take your challenge.', effect: 'switch_player' },
    { id: 'c2', name: 'STEAL', icon: '💰', desc: 'Steal 2 points from another player.', effect: 'steal_points', amount: 2 },
    { id: 'c3', name: 'TARGET', icon: '🎯', desc: 'Choose who plays next.', effect: 'choose_next' },
    { id: 'c4', name: 'REVENGE', icon: '💀', desc: 'The previous player gives you a mini-dare.', effect: 'custom_dare_prev' },
    { id: 'c5', name: 'GAMBLE', icon: '🎲', desc: 'Risk 3 points for a chance to win 6. Flip a coin!', effect: 'gamble_points', risk: 3, reward: 6 },
    { id: 'c6', name: 'KING', icon: '👑', desc: 'You control the next round. You assign the next challenge.', effect: 'become_king' },
    { id: 'c7', name: 'DOUBLE', icon: '✖️', desc: 'Next challenge points are doubled (win or lose).', effect: 'double_points' },
    { id: 'c8', name: 'WIPE', icon: '🧹', desc: 'Lowest score player steals 1 point from highest score player.', effect: 'robin_hood' },
    { id: 'c9', name: 'SILENCE', icon: '🤐', desc: 'You cannot speak until your next turn.', effect: 'status_silenced' },
    { id: 'c10', name: 'FREEZE', icon: '🧊', desc: 'Skip your next turn.', effect: 'skip_turn' },
    { id: 'c11', name: 'TRUTH SERUM', icon: '🧪', desc: 'You must answer the next truth honestly, no skipping.', effect: 'force_truth' },
    { id: 'c12', name: 'DARE DEVIL', icon: '🔥', desc: 'You must take a Dare next turn, no skipping.', effect: 'force_dare' },
    { id: 'c13', name: 'REVERSE', icon: '⏪', desc: 'Turn order is reversed.', effect: 'reverse_order' },
    { id: 'c14', name: 'BLIND', icon: '🙈', desc: 'You must play the next round blindfolded.', effect: 'status_blind' },
    { id: 'c15', name: 'CHARITY', icon: '🎁', desc: 'Give 1 of your points to another player.', effect: 'give_point', amount: 1 },
    { id: 'c16', name: 'VAMPIRE', icon: '🧛', desc: 'Drain 1 point from everyone else.', effect: 'drain_points', amount: 1 },
    { id: 'c17', name: 'EARTHQUAKE', icon: '🌋', desc: 'Everyone must move to a new seat right now.', effect: 'none' },
    { id: 'c18', name: 'AMNESIA', icon: '😵', desc: 'Forget your score. It is hidden until the end of the game.', effect: 'hide_score' },
    { id: 'c19', name: 'MIMIC', icon: '👯', desc: 'You must copy everything the person to your left does until next turn.', effect: 'status_mimic' },
    { id: 'c20', name: 'BOMB', icon: '💣', desc: 'Lose 3 points instantly.', effect: 'lose_points', amount: 3 }
];

// Add Mystery Rewards
gameData.rewards = [
    { id: 'r1', name: '+5 Points', icon: '💰', desc: 'You found a stash of points!', effect: 'add_points', amount: 5 },
    { id: 'r2', name: 'Skip Card', icon: '🃏', desc: 'Use this to skip one future challenge.', effect: 'give_item', item: 'skip_card' },
    { id: 'r3', name: 'Reroll Token', icon: '🔄', desc: 'Reroll any challenge once.', effect: 'give_item', item: 'reroll_token' },
    { id: 'r4', name: 'Immunity', icon: '🛡️', desc: 'Immune to the next Chaos Event.', effect: 'give_item', item: 'immunity' },
    { id: 'r5', name: 'Double Points', icon: '✖️2', desc: 'Your next success gives double points.', effect: 'buff_next_win' },
    { id: 'r6', name: 'Steal 3', icon: '🥷', desc: 'Steal 3 points from the leader.', effect: 'steal_leader', amount: 3 },
    { id: 'r7', name: '+10 Trust', icon: '🤝', desc: 'Everyone trusts you a little more.', effect: 'add_trust', amount: 10 },
    { id: 'r8', name: 'Give Dare', icon: '🎯', desc: 'Assign a custom dare to anyone right now.', effect: 'instant_custom_dare' },
    { id: 'r9', name: 'King Crown', icon: '👑', desc: 'Become King for a round.', effect: 'become_king' },
    { id: 'r10', name: 'Jackpot', icon: '🎰', desc: 'Gain 10 points!', effect: 'add_points', amount: 10 }
];

// Add Chain Challenges (Used when Chain is activated)
gameData.chains = [
    { id: 'ch1', level: 2, text: "Choose a player to do 10 pushups." },
    { id: 'ch2', level: 3, text: "They must choose someone else to sing a song." },
    { id: 'ch3', level: 4, text: "That person chooses someone to answer a deep truth." },
    { id: 'ch4', level: 5, text: "The chain ends. The last person must let the group tickle them for 10 seconds." }
];

// Add Battle Challenges (For Battle Mode)
gameData.battles = [
    { id: 'b1', text: "Staring contest. First to blink loses." },
    { id: 'b2', text: "Thumb war. Best 2 out of 3." },
    { id: 'b3', text: "Rock, Paper, Scissors. Best of 3." },
    { id: 'b4', text: "Roast battle. Group votes on the winner." },
    { id: 'b5', text: "Dance off. Group votes on the winner." },
    { id: 'b6', text: "Try not to laugh. The rest of the group tries to make you laugh." },
    { id: 'b7', text: "Arm wrestling." },
    { id: 'b8', text: "Who can hold their breath the longest?" }
];

// Export for module usage (if needed, otherwise global)
window.gameData = gameData;
