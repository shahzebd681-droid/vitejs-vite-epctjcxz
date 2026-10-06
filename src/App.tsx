import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./lib/supabase";


/* =========================================================


APNA MATKA


Virtual USD Coin Game


========================================================= */




const kolkataBazi = [


{ no: 1, time: "10:00 AM" },


{ no: 2, time: "11:30 AM" },


{ no: 3, time: "1:00 PM" },


{ no: 4, time: "2:30 PM" },


{ no: 5, time: "4:00 PM" },


{ no: 6, time: "5:30 PM" },


{ no: 7, time: "7:00 PM" },


{ no: 8, time: "8:30 PM" },


];




const dusBazi = [


{ no: 1, time: "9:30 AM" },

{ no: 2, time: "11:00 AM" },


{ no: 3, time: "12:30 PM" },


{ no: 4, time: "2:00 PM" },


{ no: 5, time: "3:30 PM" },


{ no: 6, time: "5:00 PM" },


{ no: 7, time: "6:30 PM" },


{ no: 8, time: "8:00 PM" },


{ no: 9, time: "9:30 PM" },


{ no: 10, time: "11:00 PM" },


];




const mainBazarMarkets = [


{ market: "OPEN", time: "9:30 PM" },


{ market: "CLOSE", time: "11:00 PM" },


];




const amountOptions = [5, 10, 20, 50, 100, 200, 500, 1000];

const betRates: Record<string, number> = {


Single: 9,


"Single Patti": 125,


"Double Patti": 200,


"Triple Patti": 300,


Jodi: 85,


};




/* =========================================================


SINGLE PATTI - SOURCE OF TRUTH


10 Ank groups × 12 Patti


========================================================= */




const singlePatti: Record<number, string[]> = {


0: [


"127",


"136",


"145",


"190",

"235",


"280",


"370",


"389",


"460",


"479",


"569",


"578",


],


1: [


"128",


"137",


"146",


"236",


"245",


"290",


"380",


"470",

"489",


"560",


"579",


"678",


],


2: [


"129",


"138",


"147",


"156",


"237",


"246",


"345",


"390",


"480",


"570",


"589",


"679",


],

3: [


"120",


"139",


"148",


"157",


"238",


"247",


"256",


"346",


"490",


"580",


"670",


"689",


],


4: [


"130",


"149",


"158",

"167",


"239",


"248",


"257",


"347",


"356",


"590",


"680",


"789",


],


5: [


"140",


"159",


"168",


"230",


"249",


"258",


"267",


"348",

"357",


"456",


"690",


"780",


],


6: [


"123",


"150",


"169",


"178",


"240",


"259",


"268",


"349",


"358",


"367",


"457",


"790",

],


7: [


"124",


"160",


"179",


"250",


"269",


"278",


"340",


"359",


"368",


"458",


"467",


"890",


],


8: [


"125",


"134",


"170",

"189",


"260",


"279",


"350",


"369",


"378",


"459",


"468",


"567",


],


9: [


"126",


"135",


"180",


"234",


"270",


"289",


"360",

"379",


"450",


"469",


"478",


"568",


],


};




/* =========================================================


DOUBLE PATTI


10 Ank groups × 9 Patti


========================================================= */




const doublePatti: Record<number, string[]> = {


0: ["118", "226", "244", "299", "334", "488", "550", "668", "677"],


1: ["100", "119", "155", "227", "335", "344", "399", "588", "669"],


2: ["110", "200", "228", "255", "336", "499", "660", "688", "778"],


3: ["166", "229", "300", "337", "355", "445", "599", "779", "788"],


4: ["112", "220", "266", "338", "400", "446", "455", "699", "770"],

5: ["113", "122", "177", "339", "366", "447", "500", "799", "889"],


6: ["114", "277", "330", "448", "466", "556", "600", "880", "899"],


7: ["115", "133", "188", "223", "377", "449", "557", "566", "700"],


8: ["116", "224", "233", "288", "440", "477", "558", "800", "990"],


9: ["117", "144", "199", "225", "388", "559", "577", "667", "900"],


};




const triplePatti = [


"000",


"111",


"222",


"333",


"444",


"555",


"666",


"777",


"888",


"999",

];




type Page =


| "home"


| "betting"


| "history"


| "profile"


| "result"


| "statement";


type GameName = "Main Bazar" | "Kolkata Fatafat" | "Dus ka Dum";


type BetType =


| "Single"


| "Single Patti"


| "Double Patti"


| "Triple Patti"


| "Jodi";




type BetHistoryItem = {


id: number;


date: string;


time: string;

game: string;

sessionCode: string;


market: string;


bazi: string;


type: string;


number: string;


amount: number;

rate: number;


status: string;


result: string;


wonAmount: number;


};




type StatementItem = {


id: number;


date: string;


time: string;


type: "CREDIT" | "DEBIT";


performedBy: "SUPER ADMIN" | "AGENT ADMIN";


amount: number;


balance: number;


};

function App() {



/* =========================================================


AUTH


========================================================= */




const [showLogin, setShowLogin] = useState(false);


const [showSignup, setShowSignup] = useState(false);


const [email, setEmail] = useState("");
const [loginIdentifier, setLoginIdentifier] = useState("");
const [signupUsername, setSignupUsername] = useState("");


const [name, setName] = useState("");


const [password, setPassword] = useState("");


const [confirmPassword, setConfirmPassword] = useState("");


const [authMessage, setAuthMessage] = useState("");


const [authError, setAuthError] = useState("");
const [forcePasswordReset, setForcePasswordReset] = useState(false);
const [passwordResetCurrent, setPasswordResetCurrent] = useState("");
const [passwordResetNew, setPasswordResetNew] = useState("");
const [passwordResetConfirm, setPasswordResetConfirm] = useState("");
const [passwordResetLoading, setPasswordResetLoading] = useState(false);
const [passwordResetError, setPasswordResetError] = useState("");
const [passwordResetSuccess, setPasswordResetSuccess] = useState("");
const [adminPasswordResetTarget, setAdminPasswordResetTarget] = useState("");
const [adminPasswordResetPassword, setAdminPasswordResetPassword] = useState("");




/* =========================================================


CUSTOMER


========================================================= */




const [isLoggedIn, setIsLoggedIn] = useState(false);
const [authReady, setAuthReady] = useState(false);
const [userRole, setUserRole] = useState<"SUPER_ADMIN" | "AGENT_ADMIN" | "CUSTOMER" | null>(null);
const [adminLoading, setAdminLoading] = useState(false);
const [adminError, setAdminError] = useState("");
const [adminSuccess, setAdminSuccess] = useState("");
const [adminStats, setAdminStats] = useState({ agents: 0, customers: 0, onlineCustomers: 0, available: 0, exposure: 0 });
const [adminAccountStats, setAdminAccountStats] = useState({
  totalSupply: 0,
  superAdminAvailable: 0,
  totalSpendable: 0,
  distributed: 0,
  agentAvailable: 0,
  agentExposure: 0,
  customerAvailable: 0,
  customerExposure: 0,
  networkAvailable: 0,
  networkExposure: 0,
  supplyChange: null as number | null,
});
const [adminAgents, setAdminAgents] = useState<Array<{
  id: string;
  agent_code: string;
  profile_id: string;
  status: string;
  username: string;
  available_balance: number;
  exposure_balance: number;
  wallet_status: string;
}>>([]);
const [onlineCustomers, setOnlineCustomers] = useState<Array<{
  id: string;
  profile_id: string;
  customer_code: string;
  username: string;
  status: string;
  available_balance: number;
}>>([]);
const [onlineCoinCustomerId, setOnlineCoinCustomerId] = useState("");
const [onlineCoinAmount, setOnlineCoinAmount] = useState("");

const [superAdminAccountView, setSuperAdminAccountView] = useState<"CUSTOMER" | "AGENT" | null>(null);
const [superAdminCustomerAccounts, setSuperAdminCustomerAccounts] = useState<Array<{
  id: string; profile_id: string; username: string; customer_code: string; source: string;
  agent_id: string | null; agent_username: string; available_balance: number; exposure_balance: number;
  status: string; wallet_status: string;
}>>([]);
const [superAdminAgentAccounts, setSuperAdminAgentAccounts] = useState<Array<{
  id: string; profile_id: string; username: string; agent_code: string; available_balance: number;
  exposure_balance: number; status: string; wallet_status: string;
}>>([]);
const [superAdminAccountSearch, setSuperAdminAccountSearch] = useState("");
const [superAdminAccountPage, setSuperAdminAccountPage] = useState(1);
const [selectedAdminAccount, setSelectedAdminAccount] = useState<any>(null);
const [agentAllCustomers, setAgentAllCustomers] = useState<Array<{
  id: string; profile_id: string; username: string; customer_code: string; full_name: string; email: string;
  available_balance: number; exposure_balance: number; status: string; wallet_status: string;
}>>([]);
const [agentAllCustomerSearch, setAgentAllCustomerSearch] = useState("");
const [agentAllCustomerPage, setAgentAllCustomerPage] = useState(1);
const [selectedAgentCustomer, setSelectedAgentCustomer] = useState<any>(null);
const [agentAllCustomerLoading, setAgentAllCustomerLoading] = useState(false);

const [adminModule, setAdminModule] = useState<"HOME" | "ACCOUNT_OVERVIEW" | "ACCOUNT_DIRECTORY" | "AGENT_ADMIN" | "AGENT_WALLET" | "DEPOSIT_AGENT" | "WITHDRAW_AGENT" | "ONLINE_CUSTOMER" | "RESULTS" | "SETTLEMENT" | "BET_ANALYZER" | "REPORTS" | "AUDIT" | "CONTACT" | "PASSWORD_RESET">("HOME");
const [contactWhatsappLink, setContactWhatsappLink] = useState("");
const [contactTelegramLink, setContactTelegramLink] = useState("");
const [contactLoading, setContactLoading] = useState(false);
const [agentWalletAction, setAgentWalletAction] = useState<"DEPOSIT" | "WITHDRAW" | null>(null);
const [auditLoading, setAuditLoading] = useState(false);
const [auditView, setAuditView] = useState<"HOME" | "TRANSACTION" | "SETTLEMENT">("HOME");
const [auditTransactionRows, setAuditTransactionRows] = useState<Array<{
  transaction_id: string;
  transaction_code: string;
  created_at: string;
  username: string | null;
  counterparty_type: string | null;
  direction: string;
  amount: number;
  super_admin_available_after: number;
}>>([]);
const [auditTransactionPage, setAuditTransactionPage] = useState(0);
const [auditTransactionHasNext, setAuditTransactionHasNext] = useState(false);
const [auditSettlementRows, setAuditSettlementRows] = useState<Array<{
  settlement_id: string;
  settlement_code: string;
  settled_at: string;
  game_name: string;
  bazi_label: string;
  result_text: string;
  settlement_amount: number;
  network_change: number;
  network_unburned_available_after: number;
}>>([]);
const [auditSettlementPage, setAuditSettlementPage] = useState(0);
const [auditSettlementHasNext, setAuditSettlementHasNext] = useState(false);
const [reportsLoading, setReportsLoading] = useState(false);
const [reportsRows, setReportsRows] = useState<Array<{
  id: string;
  bet_time: string;
  username: string;
  customer_source: string;
  agent_username: string;
  game_name: string;
  session_code: string;
  bazi_no: number | null;
  market: string;
  bet_type: string;
  played_number: string;
  stake: number;
  rate: number;
  potential_win: number;
  result: string;
  status: string;
}>>([]);
const [reportsPage, setReportsPage] = useState(0);
const [reportsTotal, setReportsTotal] = useState(0);

const [resultGames, setResultGames] = useState<Array<{ id: string; game_code: string; game_name: string }>>([]);
const [resultSessions, setResultSessions] = useState<Array<{
  id: string;
  session_code: string;
  game_id: string;
  game_code: string;
  game_name: string;
  session_date: string;
  bazi_no: number | null;
  market: string;
  status: string;
  market_status: string;
  opening_time: string;
  deadline_at: string;
  result_expected_at: string | null;
}>>([]);
const [resultGameId, setResultGameId] = useState("");
const [resultDate, setResultDate] = useState("");
const [resultSessionId, setResultSessionId] = useState("");
const [resultSingleDigit, setResultSingleDigit] = useState("");
const [resultPatti, setResultPatti] = useState("");
const [resultCurrent, setResultCurrent] = useState<{
  id: string;
  result_code: string;
  version_no: number;
  single_digit: number;
  patti: string;
  status: string;
  is_current: boolean;
  declared_at: string;
} | null>(null);

const [settlementSessions, setSettlementSessions] = useState<Array<{
  id: string; session_code: string; game_name: string; session_date: string;
  bazi_no: number | null; market: string; result_id: string; single_digit: string;
  patti: string; active_bets: number; exposure: number;
}>>([]);
const [settlementLoading, setSettlementLoading] = useState(false);

// Bet Analyzer
const [betAnalyzerView, setBetAnalyzerView] = useState<"HOME" | "ANALYZER">("HOME");
const [betAnalyzerSessions, setBetAnalyzerSessions] = useState<any[]>([]);
const [betAnalyzerSelectorSessions, setBetAnalyzerSelectorSessions] = useState<any[]>([]);
const [betAnalyzerSelectedSessionId, setBetAnalyzerSelectedSessionId] = useState("");
const [betAnalyzerSelectedSession, setBetAnalyzerSelectedSession] = useState<any | null>(null);
const [betAnalyzerRows, setBetAnalyzerRows] = useState<any[]>([]);
const [betAnalyzerLoading, setBetAnalyzerLoading] = useState(false);
const [betAnalyzerGameId, setBetAnalyzerGameId] = useState("");
const [betAnalyzerBaziValue, setBetAnalyzerBaziValue] = useState("");
const [betAnalyzerDate, setBetAnalyzerDate] = useState(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; });
const [betAnalyzerOpenPanel, setBetAnalyzerOpenPanel] = useState<"SINGLE" | "PATTI" | "JODI" | null>("SINGLE");
const [betAnalyzerHadLiveData, setBetAnalyzerHadLiveData] = useState(false);

const [agentUsername, setAgentUsername] = useState("");
const [agentFullName, setAgentFullName] = useState("");
const [agentEmail, setAgentEmail] = useState("");
const [agentPassword, setAgentPassword] = useState("");
const [agentConfirmPassword, setAgentConfirmPassword] = useState("");

const [allocationAgentProfileId, setAllocationAgentProfileId] = useState("");
const [allocationAmount, setAllocationAmount] = useState("");
const [allocationNote, setAllocationNote] = useState("");

// Agent Admin customer management
const [agentDashboardModule, setAgentDashboardModule] = useState<"HOME" | "ACCOUNT_OVERVIEW" | "CUSTOMERS" | "CREATE_CUSTOMER" | "DEPOSIT_WITHDRAW" | "BET_HISTORY" | "EXPOSURE" | "PASSWORD_RESET">("HOME");
const [agentOverviewStats, setAgentOverviewStats] = useState({ agentAvailable: 0, customerAvailable: 0, customerExposure: 0, customers: 0 });
const [agentCustomerSearchTotal, setAgentCustomerSearchTotal] = useState(0);
const [agentExposureRows, setAgentExposureRows] = useState<Array<{ id: string; username: string; customer_code: string; exposure_balance: number; available_balance: number; status: string }>>([]);
const [agentReportsLoading, setAgentReportsLoading] = useState(false);
const [agentReportsRows, setAgentReportsRows] = useState<Array<{
  id: string; bet_time: string; username: string; game_name: string; session_code: string; bazi_no: number | null;
  market: string; bet_type: string; played_number: string; stake: number; rate: number; potential_win: number; result: string; status: string;
}>>([]);
const [agentReportsPage, setAgentReportsPage] = useState(0);
const [agentReportsTotal, setAgentReportsTotal] = useState(0);

const [agentCustomerLoading, setAgentCustomerLoading] = useState(false);
const [agentCustomerError, setAgentCustomerError] = useState("");
const [agentCustomerSuccess, setAgentCustomerSuccess] = useState("");
const [agentCustomerPage, setAgentCustomerPage] = useState(1);
const [agentCustomers, setAgentCustomers] = useState<Array<{
  id: string;
  customer_code: string;
  profile_id: string;
  username: string;
  full_name: string;
  email: string;
  status: string;
}>>([]);
const [agentCustomerUsername, setAgentCustomerUsername] = useState("");
const [agentCustomerFullName, setAgentCustomerFullName] = useState("");
const [agentCustomerEmail, setAgentCustomerEmail] = useState("");
const [agentCustomerPassword, setAgentCustomerPassword] = useState("");
const [agentCustomerConfirmPassword, setAgentCustomerConfirmPassword] = useState("");
const [showAgentCustomerForm, setShowAgentCustomerForm] = useState(false);
const [agentCoinModule, setAgentCoinModule] = useState<"OVERVIEW" | "DEPOSIT_CUSTOMER" | "WITHDRAW_CUSTOMER" | "PASSWORD_RESET" | "CHANGE_PASSWORD">("OVERVIEW");
const [agentCoinCustomerProfileId, setAgentCoinCustomerProfileId] = useState("");
const [agentCoinAmount, setAgentCoinAmount] = useState("");
const [agentCoinNote, setAgentCoinNote] = useState("");

const getFreshAgentAdminAccessToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  let session = data.session;
  if (!session) {
    throw new Error("Your Super Admin session is missing. Please log out and log in again.");
  }

  const expiresAtMs = (session.expires_at || 0) * 1000;
  if (!expiresAtMs || expiresAtMs <= Date.now() + 60_000) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) throw refreshError;
    session = refreshed.session;
  }

  const accessToken = session?.access_token;
  if (!accessToken) {
    throw new Error("Your Super Admin access token is missing or expired. Please log out and log in again.");
  }

  return accessToken;
};

const loadResultsModule = async () => {
  setAdminLoading(true);
  setAdminError("");
  setAdminSuccess("");
  try {
    const [gamesResult, sessionsResult] = await Promise.all([
      supabase
        .from("games")
        .select("id, game_code, game_name")
        .order("game_code", { ascending: true }),
      supabase
        .from("game_sessions")
        .select("id, session_code, game_id, session_date, bazi_no, market, status, market_status, opening_time, deadline_at, result_expected_at")
        .eq("scheduled_playable", true)
        .order("session_date", { ascending: false })
        .order("bazi_no", { ascending: true, nullsFirst: true })
        .order("market", { ascending: true }),
    ]);
    if (gamesResult.error) throw gamesResult.error;
    if (sessionsResult.error) throw sessionsResult.error;

    const games = (gamesResult.data || []).map((game) => ({
      id: String(game.id),
      game_code: String(game.game_code || ""),
      game_name: String(game.game_name || game.game_code || "Game"),
    }));
    const gameMap = new Map<string, { id: string; game_code: string; game_name: string }>(games.map((game) => [game.id, game]));
    const sessions = (sessionsResult.data || []).map((session) => {
      const game = gameMap.get(String(session.game_id));
      return {
        id: String(session.id),
        session_code: String(session.session_code || ""),
        game_id: String(session.game_id),
        game_code: game?.game_code || "",
        game_name: game?.game_name || "Game",
        session_date: String(session.session_date || ""),
        bazi_no: session.bazi_no == null ? null : Number(session.bazi_no),
        market: String(session.market || ""),
        status: String(session.status || ""),
        market_status: String(session.market_status || ""),
        opening_time: String(session.opening_time || ""),
        deadline_at: String(session.deadline_at || ""),
        result_expected_at: session.result_expected_at ? String(session.result_expected_at) : null,
      };
    });

    setResultGames(games);
    setResultSessions(sessions);
    if (!resultGameId && games.length > 0) {
      setResultGameId(games[0].id);
    }
    if (!resultDate && sessions.length > 0) {
      setResultDate(sessions[0].session_date);
    }
  } catch (error: any) {
    console.error("=== RESULTS MODULE LOAD ERROR ===", error);
    setAdminError(`RESULTS LOAD ERROR — ${error?.message || String(error)}`);
  } finally {
    setAdminLoading(false);
  }
};

const loadCurrentResult = async (sessionId: string) => {
  setResultCurrent(null);
  if (!sessionId) return;
  const { data, error } = await supabase
    .from("results")
    .select("id, result_code, version_no, single_digit, patti, status, is_current, declared_at")
    .eq("session_id", sessionId)
    .eq("is_current", true)
    .order("version_no", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("=== CURRENT RESULT LOAD ERROR ===", error);
    setAdminError(`RESULT LOAD ERROR — ${error.message}`);
    return;
  }
  if (data) {
    setResultCurrent({
      id: String(data.id),
      result_code: String(data.result_code || ""),
      version_no: Number(data.version_no || 1),
      single_digit: Number(data.single_digit),
      patti: String(data.patti || ""),
      status: String(data.status || ""),
      is_current: Boolean(data.is_current),
      declared_at: String(data.declared_at || ""),
    });
  }
};

const declareSelectedGameResult = async () => {
  setAdminError("");
  setAdminSuccess("");

  if (!resultSessionId) {
    setAdminError("Please select a game session.");
    return;
  }
  if (!/^[0-9]$/.test(resultSingleDigit)) {
    setAdminError("Single Digit must be one digit from 0 to 9.");
    return;
  }
  if (!/^[0-9]{3}$/.test(resultPatti)) {
    setAdminError("Patti must contain exactly 3 digits.");
    return;
  }

  setAdminLoading(true);
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const declaredBy = userData.user?.id;
    if (!declaredBy) throw new Error("AUTHENTICATION_REQUIRED");

    const { data, error } = await supabase.rpc("declare_game_result", {
      p_game_session_id: resultSessionId,
      p_single_digit: Number(resultSingleDigit),
      p_patti: resultPatti,
      p_declared_by: declaredBy,
    });
    if (error) throw error;

    const result = Array.isArray(data) ? data[0] : data;
    if (!result) throw new Error("Result declaration completed but no result was returned.");

    await loadCurrentResult(resultSessionId);
    setResultSingleDigit("");
    setResultPatti("");
    setAdminSuccess(`Result declared successfully. ${resultSingleDigit} / ${resultPatti} has been declared for the selected session. Settlement remains a separate step.`);
  } catch (error: any) {
    console.error("=== DECLARE GAME RESULT ERROR ===", error);
    setAdminError(error?.message || String(error));
  } finally {
    setAdminLoading(false);
  }
};

const allocateVirtualUsdToAgent = async () => {
  setAdminLoading(true);
  setAdminError("");
  setAdminSuccess("");

  try {
    if (!allocationAgentProfileId) {
      throw new Error("Please select an Agent Admin.");
    }

    const amount = Number(allocationAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Enter a valid allocation amount greater than $0.");
    }

    if (Math.round(amount * 100) !== amount * 100) {
      throw new Error("Allocation amount can have a maximum of 2 decimal places.");
    }

    await getFreshAgentAdminAccessToken();

    const { data, error } = await supabase.rpc(
      "allocate_virtual_usd_to_agent",
      {
        p_agent_profile_id: allocationAgentProfileId,
        p_amount: amount,
        p_note: allocationNote.trim() || null,
      }
    );

    if (error) throw error;

    const allocation = Array.isArray(data) ? data[0] : data;

    if (!allocation) {
      throw new Error("Allocation completed but no result was returned.");
    }

    setAllocationAmount("");
    setAllocationNote("");
    setAdminError(
      `Virtual USD allocated successfully. $${Number(allocation.allocated_amount || amount).toFixed(2)} sent to the selected Agent. Remaining supply: $${Number(allocation.remaining_supply || 0).toFixed(2)}.`
    );

    await loadSuperAdminDashboard();
  } catch (error: any) {
    console.error("=== VIRTUAL USD ALLOCATION ERROR ===", error);
    setAdminSuccess("");
    setAdminError(
      error?.message || "Unable to allocate virtual USD to Agent Admin."
    );
  } finally {
    setAdminLoading(false);
  }
};



const getCurrentSuperAdminMainSupply = async () => {
  const { data, error } = await supabase.rpc("get_super_admin_main_supply");

  if (error) throw error;

  const supply = Array.isArray(data) ? data[0] : data;

  return Number(supply?.super_admin_available || 0);
};

const withdrawVirtualUsdFromAgent = async () => {
  setAdminLoading(true);
  setAdminError("");
  setAdminSuccess("");

  try {
    if (!allocationAgentProfileId) {
      throw new Error("Please select an Agent Admin.");
    }

    const amount = Number(allocationAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Enter a valid withdrawal amount greater than $0.");
    }

    if (Math.round(amount * 100) !== amount * 100) {
      throw new Error("Withdrawal amount can have a maximum of 2 decimal places.");
    }

    const selectedAgent = adminAgents.find(
      (agent) => agent.profile_id === allocationAgentProfileId
    );

    if (!selectedAgent?.id) {
      throw new Error("Selected Agent Admin was not found.");
    }

    const { data, error } = await supabase.rpc(
      "transfer_virtual_usd_super_admin_agent",
      {
        p_agent_id: selectedAgent.id,
        p_amount: amount,
        p_direction: "AGENT_TO_SUPER_ADMIN",
        p_note: allocationNote.trim() || null,
      }
    );

    if (error) throw error;

    const result = Array.isArray(data) ? data[0] : data;

    if (!result) {
      throw new Error("Withdrawal completed but no result was returned.");
    }

    setAllocationAmount("");
    setAllocationNote("");
    setAdminSuccess(
      `Virtual USD withdrawn successfully. $${amount.toFixed(2)} returned from ${selectedAgent.username || selectedAgent.agent_code} to Super Admin supply. Agent balance: $${Number(result.agent_balance || 0).toFixed(2)}. Super Admin Available Supply: $${Number(result.super_admin_available_supply || 0).toFixed(2)}.`
    );

    await loadSuperAdminDashboard();
  } catch (error: any) {
    console.error("=== SUPER ADMIN AGENT WITHDRAWAL ERROR ===", error);
    setAdminSuccess("");
    setAdminError(error?.message || String(error));
  } finally {
    setAdminLoading(false);
  }
};

const loadAgentAccountOverview = async () => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const callerId = userData.user?.id;
    if (!callerId) throw new Error("Agent Admin session is missing. Please log in again.");

    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("id")
      .eq("profile_id", callerId)
      .eq("status", "ACTIVE")
      .maybeSingle();
    if (agentError) throw agentError;
    if (!agent?.id) throw new Error("Active Agent Admin record was not found.");

    const { data: customerRows, error: customerError, count } = await supabase
      .from("customers")
      .select("id, profile_id, customer_code, status, created_at", { count: "exact" })
      .eq("agent_id", agent.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (customerError) throw customerError;

    const profileIds = (customerRows || []).map((row: any) => row.profile_id).filter(Boolean);
    const [agentWalletResult, customerWalletResult, profileResult] = await Promise.all([
      supabase.from("wallets").select("available_balance, exposure_balance, currency, status").eq("owner_profile_id", callerId).eq("currency", "USD").eq("status", "ACTIVE").maybeSingle(),
      profileIds.length
        ? supabase.from("wallets").select("owner_profile_id, available_balance, exposure_balance, currency, status").in("owner_profile_id", profileIds).eq("currency", "USD").eq("status", "ACTIVE")
        : Promise.resolve({ data: [], error: null }),
      profileIds.length
        ? supabase.from("profiles").select("id, username").in("id", profileIds)
        : Promise.resolve({ data: [], error: null }),
    ]);
    if (agentWalletResult.error) throw agentWalletResult.error;
    if (customerWalletResult.error) throw customerWalletResult.error;
    if (profileResult.error) throw profileResult.error;

    const walletMap = new Map((customerWalletResult.data || []).map((wallet: any) => [String(wallet.owner_profile_id), wallet]));
    const profileMap = new Map((profileResult.data || []).map((profile: any) => [String(profile.id), String(profile.username || "")]));
    const exposureRows = (customerRows || []).map((customer: any) => {
      const wallet = walletMap.get(String(customer.profile_id));
      return {
        id: String(customer.id),
        username: profileMap.get(String(customer.profile_id)) || String(customer.customer_code || ""),
        customer_code: String(customer.customer_code || ""),
        exposure_balance: Number(wallet?.exposure_balance || 0),
        available_balance: Number(wallet?.available_balance || 0),
        status: String(customer.status || "ACTIVE"),
      };
    });

    const customerAvailable = exposureRows.reduce((sum, row) => sum + row.available_balance, 0);
    const customerExposure = exposureRows.reduce((sum, row) => sum + row.exposure_balance, 0);
    const agentAvailable = Number(agentWalletResult.data?.available_balance || 0);

    setAgentOverviewStats({
      agentAvailable,
      customerAvailable,
      customerExposure,
      customers: Number(count || 0),
    });
    setAgentExposureRows(exposureRows);
  } catch (error: any) {
    setAgentCustomerError(error?.message || String(error));
  }
};

const loadAgentCustomerPage = async (page = agentCustomerPage) => {
  setAgentCustomerLoading(true);
  setAgentCustomerError("");

  try {
    const accessToken = await getFreshAgentAdminAccessToken();
    const { data, error } = await supabase.functions.invoke("agent-customer-admin", {
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { action: "list", page: Math.max(1, page), page_size: 25, search: "" },
    });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error || "Unable to load customer accounts.");

    setAgentCustomers(data.customers || []);
    setAgentCustomerSearchTotal(Number(data.total || 0));
    setAgentCustomerPage(Math.max(1, page));
    await loadAgentAccountOverview();
    if (page === 1) await loadAgentAllCustomerAccounts(1, agentAllCustomerSearch);
  } catch (error: any) {
    setAgentCustomerSuccess("");
    setAgentCustomerError(error?.message || String(error));
  } finally {
    setAgentCustomerLoading(false);
  }
};

const createAgentCustomer = async () => {
  setAgentCustomerError("");
  setAgentCustomerSuccess("");
  const username = agentCustomerUsername.trim().toLowerCase();
  const fullName = agentCustomerFullName.trim();
  const email = agentCustomerEmail.trim().toLowerCase();

  if (!username) return setAgentCustomerError("Username is required.");
  if (username.length < 3 || username.length > 50 || !/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(username)) {
    return setAgentCustomerError("Username must be 3–50 characters and use only letters, numbers, dot, underscore or hyphen.");
  }
  if (fullName.length > 100) return setAgentCustomerError("Full name must be 100 characters or less.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setAgentCustomerError("Please enter a valid email address.");
  if (agentCustomerPassword.length < 8 || agentCustomerPassword.length > 16) return setAgentCustomerError("Password must be 8 to 16 characters.");
  if (agentCustomerPassword !== agentCustomerConfirmPassword) return setAgentCustomerError("Passwords do not match.");

  setAgentCustomerLoading(true);
  try {
    const accessToken = await getFreshAgentAdminAccessToken();
    const { data, error } = await supabase.functions.invoke("agent-customer-admin", {
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { action: "create", username, full_name: fullName || null, email: email || null, password: agentCustomerPassword },
    });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error || "Unable to create customer account.");

    setAgentCustomerUsername("");
    setAgentCustomerFullName("");
    setAgentCustomerEmail("");
    setAgentCustomerPassword("");
    setAgentCustomerConfirmPassword("");
    setShowAgentCustomerForm(false);
    setAgentCustomerSuccess(`Customer created successfully. Customer Code: ${data.customer?.customer_code || "N/A"}`);
    await loadAgentCustomerPage(1);
  } catch (error: any) {
    setAgentCustomerSuccess("");
    setAgentCustomerError(error?.message || String(error));
  } finally {
    setAgentCustomerLoading(false);
  }
};

const transferAgentCustomerVirtualUsd = async (direction: "AGENT_TO_CUSTOMER" | "CUSTOMER_TO_AGENT") => {
  setAgentCustomerError("");
  setAgentCustomerSuccess("");

  if (!agentCoinCustomerProfileId) {
    setAgentCustomerError("Please select a Customer.");
    return;
  }

  const amount = Number(agentCoinAmount);
  if (!Number.isFinite(amount) || amount <= 0) {
    setAgentCustomerError("Please enter a valid amount greater than 0.");
    return;
  }

  if (Math.round(amount * 100) !== amount * 100) {
    setAgentCustomerError("Amount can have a maximum of 2 decimal places.");
    return;
  }

  setAgentCustomerLoading(true);

  try {
    const { data, error } = await supabase.rpc(
      "transfer_virtual_usd_agent_customer",
      {
        p_customer_id: agentCoinCustomerProfileId,
        p_amount: amount,
        p_direction: direction,
      }
    );

    if (error) throw error;

    const result = Array.isArray(data) ? data[0] : data;
    if (!result) {
      throw new Error("Transfer completed but no result was returned.");
    }

    setAgentCoinAmount("");
    const successMessage =
      direction === "AGENT_TO_CUSTOMER"
        ? `Virtual USD deposited successfully. $${amount.toFixed(2)} sent to the selected Customer. Customer balance: $${Number(result.customer_balance || 0).toFixed(2)}.`
        : `Virtual USD withdrawn successfully. $${amount.toFixed(2)} returned from the selected Customer. Customer balance: $${Number(result.customer_balance || 0).toFixed(2)}.`;

    await loadAgentCustomerPage(1);
    setAgentCustomerSuccess(successMessage);
  } catch (error: any) {
    console.error("=== AGENT CUSTOMER TRANSFER ERROR ===", error);
    setAgentCustomerError(error?.message || String(error));
  } finally {
    setAgentCustomerLoading(false);
  }
};

const renderAgentCustomerCoinModule = () => {
  if (agentCoinModule === "OVERVIEW") return null;
  const isDeposit = agentCoinModule === "DEPOSIT_CUSTOMER";
  return (
    <section className="admin-panel-card">
      <div className="admin-panel-title-row">
        <div>
          <div className="admin-section-kicker">CUSTOMER WALLET CONTROL</div>
          <div className="admin-panel-title">{isDeposit ? "DEPOSIT VIRTUAL USD TO CUSTOMER" : "WITHDRAW VIRTUAL USD FROM CUSTOMER"}</div>
        </div>
        <button className="admin-small-action" type="button" onClick={() => setAgentCoinModule("OVERVIEW")}>BACK</button>
      </div>
      <div className="admin-form">
        <div className="admin-form-field">
          <label>CUSTOMER</label>
          <select className="admin-form-input" value={agentCoinCustomerProfileId} onChange={(e) => setAgentCoinCustomerProfileId(e.target.value)} disabled={agentCustomerLoading}>
            <option value="">Select Customer</option>
            {agentCustomers.filter((c) => c.status === "ACTIVE").map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.username || customer.customer_code} — {customer.full_name || "Customer"}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-form-field">
          <label>AMOUNT (USD)</label>
          <input className="admin-form-input" type="number" min="0.01" step="0.01" inputMode="decimal" value={agentCoinAmount} onChange={(e) => setAgentCoinAmount(e.target.value)} placeholder="Enter amount" />
        </div>
        <div className="admin-form-field">
          <label>NOTE (OPTIONAL)</label>
          <input className="admin-form-input" type="text" value={agentCoinNote} onChange={(e) => setAgentCoinNote(e.target.value)} placeholder={isDeposit ? "Deposit note" : "Withdrawal note"} maxLength={200} />
        </div>
        <div className="admin-form-note">{isDeposit ? "Virtual USD will move from this Agent Admin wallet to the selected Customer wallet." : "Virtual USD will move from the selected Customer wallet back to this Agent Admin wallet."}</div>
        <button
          className="admin-create-btn"
          type="button"
          onClick={() =>
            transferAgentCustomerVirtualUsd(
              isDeposit ? "AGENT_TO_CUSTOMER" : "CUSTOMER_TO_AGENT"
            )
          }
          disabled={agentCustomerLoading || agentCustomers.length === 0}
        >
          {agentCustomerLoading
            ? "PROCESSING..."
            : isDeposit
              ? "DEPOSIT VIRTUAL USD"
              : "WITHDRAW VIRTUAL USD"}
        </button>
      </div>
    </section>
  );
};


const [customerPage, setCustomerPage] = useState<Page>("home");


const [customerName, setCustomerName] = useState("Customer");


const [customerEmail, setCustomerEmail] = useState("");


const [customerProfileId, setCustomerProfileId] = useState<string | null>(null);
const [showCustomerChangePassword, setShowCustomerChangePassword] = useState(false);


const [customerId, setCustomerId] = useState<string | null>(null);


const [walletId, setWalletId] = useState<string | null>(null);





const [betSubmitting, setBetSubmitting] = useState(false);


const [walletBalance, setWalletBalance] = useState(0);


const [exposureBalance, setExposureBalance] = useState(0);
const [customerRefreshLoading, setCustomerRefreshLoading] = useState(false);




const [selectedGame, setSelectedGame] = useState("");
const [publicSelectedGame, setPublicSelectedGame] = useState<GameName | null>(null);
const [customerSelectedGame, setCustomerSelectedGame] = useState<GameName | null>(null);


const [selectedMarket, setSelectedMarket] = useState("");


const [selectedBazi, setSelectedBazi] = useState<number | null>(null);

/* =========================================================


BETTING


========================================================= */




const [betType, setBetType] = useState<BetType>("Single");


const [betAmount, setBetAmount] = useState(10);




/*


Current Bet Type only.




Example:


Single:


1 -> 20


2 -> 10


5 -> 50




When changing to Double Patti, Single's pending selection


is cleared, because each Bet Type is completed separately.

*/


const [selectedBets, setSelectedBets] = useState<


Record<string, number>


>({});


const [betHistory, setBetHistory] = useState<BetHistoryItem[]>(


[]


);




const [statement, setStatement] = useState<StatementItem[]>(


[]


);




const [historyFilter, setHistoryFilter] = useState("All");

const [historyPage, setHistoryPage] = useState(1);
const [statementPage, setStatementPage] = useState(1);




const [currentTime, setCurrentTime] = useState(new Date());

type TodayPlayableSession = {
  id: string;
   session_code: string;
  game_id: string;
  game: "Main Bazar" | "Kolkata Fatafat" | "Dus ka Dum";
  bazi_no: number | null;
  market: string;
  opening_time: string;
  deadline_at: string;
};

const [todayPlayableSessions, setTodayPlayableSessions] = useState<TodayPlayableSession[]>([]);
const [todaySessionsReady, setTodaySessionsReady] = useState(false);

type TodayGameResult = {
  session_id: string;
  game_id: string;
  game: "Main Bazar" | "Kolkata Fatafat" | "Dus ka Dum";
  bazi_no: number | null;
  market: string;
  single_digit: number;
  patti: string;
};

const [todayGameResults, setTodayGameResults] = useState<TodayGameResult[]>([]);

type CustomerResultRow = {
  session_id: string;
  game_id: string;
  game: GameName;
  session_date: string;
  bazi_no: number | null;
  market: string;
  single_digit: string;
  patti: string;
};

const [customerResultRows, setCustomerResultRows] = useState<CustomerResultRow[]>([]);
const [customerResultsLoading, setCustomerResultsLoading] = useState(false);
const [customerResultsError, setCustomerResultsError] = useState("");
const [customerResultGame, setCustomerResultGame] = useState<GameName | null>(null);

type AppNavigationHistoryState = {
  apnaMatkaNavigation: true;
  userRole: "SUPER_ADMIN" | "AGENT_ADMIN" | "CUSTOMER" | null;
  customerPage: Page;
  customerSelectedGame: GameName | null;
  publicSelectedGame: GameName | null;
  adminModule: typeof adminModule;
  superAdminAccountView: "CUSTOMER" | "AGENT" | null;
  betAnalyzerView: typeof betAnalyzerView;
  agentDashboardModule: typeof agentDashboardModule;
  agentCoinModule: typeof agentCoinModule;
  showAgentCustomerForm: boolean;
};

const navigationHistoryInitialized = useRef(false);
const applyingBrowserBack = useRef(false);
const lastNavigationKey = useRef("");

useEffect(() => {
  const getNavigationKey = () => {
    if (!isLoggedIn || !userRole) return `PUBLIC:${publicSelectedGame || "NONE"}`;

    if (userRole === "CUSTOMER") {
      return `CUSTOMER:${customerPage}:${customerSelectedGame || "NONE"}`;
    }

    if (userRole === "SUPER_ADMIN") {
      return `SUPER_ADMIN:${adminModule}:${superAdminAccountView || "NONE"}:${betAnalyzerView}`;
    }

    return `AGENT_ADMIN:${agentDashboardModule}:${agentCoinModule}:${showAgentCustomerForm ? "FORM" : "NONE"}`;
  };

  const getCurrentHistoryState = (): AppNavigationHistoryState => ({
    apnaMatkaNavigation: true,
    userRole,
    customerPage,
    customerSelectedGame,
    publicSelectedGame,
    adminModule,
    superAdminAccountView,
    betAnalyzerView,
    agentDashboardModule,
    agentCoinModule,
    showAgentCustomerForm,
  });

  const navigationKey = getNavigationKey();

  if (!navigationHistoryInitialized.current) {
    window.history.replaceState(getCurrentHistoryState(), "", window.location.href);
    lastNavigationKey.current = navigationKey;
    navigationHistoryInitialized.current = true;
  } else if (applyingBrowserBack.current) {
    applyingBrowserBack.current = false;
    lastNavigationKey.current = navigationKey;
  } else if (navigationKey !== lastNavigationKey.current) {
    window.history.pushState(getCurrentHistoryState(), "", window.location.href);
    lastNavigationKey.current = navigationKey;
  }

  const handleBrowserBack = (event: PopStateEvent) => {
    const state = event.state as Partial<AppNavigationHistoryState> | null;

    if (!state?.apnaMatkaNavigation) return;

    if (!state.userRole && !userRole && !isLoggedIn) {
      applyingBrowserBack.current = true;
      setPublicSelectedGame(state.publicSelectedGame || null);
      return;
    }

    if (state.userRole === "CUSTOMER" && userRole === "CUSTOMER") {
      applyingBrowserBack.current = true;
      setCustomerPage(state.customerPage || "home");
      setCustomerSelectedGame(state.customerSelectedGame || null);
      return;
    }

    if (state.userRole === "SUPER_ADMIN" && userRole === "SUPER_ADMIN") {
      applyingBrowserBack.current = true;
      setAdminModule(state.adminModule || "HOME");
      setSuperAdminAccountView(state.superAdminAccountView || null);
      setBetAnalyzerView(state.betAnalyzerView === "ANALYZER" ? "ANALYZER" : "HOME");
      return;
    }

    if (state.userRole === "AGENT_ADMIN" && userRole === "AGENT_ADMIN") {
      applyingBrowserBack.current = true;
      setAgentDashboardModule(state.agentDashboardModule || "HOME");
      setAgentCoinModule(state.agentCoinModule || "OVERVIEW");
      setShowAgentCustomerForm(Boolean(state.showAgentCustomerForm));
    }
  };

  window.addEventListener("popstate", handleBrowserBack);

  return () => {
    window.removeEventListener("popstate", handleBrowserBack);
  };
}, [
  isLoggedIn,
  userRole,
  customerPage,
  customerSelectedGame,
  publicSelectedGame,
  adminModule,
  superAdminAccountView,
  betAnalyzerView,
  agentDashboardModule,
  agentCoinModule,
  showAgentCustomerForm,
]);





/* =========================================================


CLOCK


========================================================= */

useEffect(() => {
  void loadContactSettings();
}, []);

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);


const getLocalDateString = (date: Date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;


const loadTodayPlayableSessions = async (sessionDate = getLocalDateString()) => {
  try {
    // Guest users cannot SELECT game_sessions directly because the existing
    // RLS policy is authenticated-only. Use the dedicated public RPC instead.
    // The RPC returns only today's scheduled-playable sessions and the game
    // name, so the guest Home uses the same source of truth as the logged-in Home.
    const { data: sessions, error: sessionError } = await supabase.rpc(
      "get_public_today_playable_sessions"
    );

    if (sessionError) throw sessionError;

    const normalized = (Array.isArray(sessions) ? sessions : [])
      .filter((session: any) => String(session.session_date || sessionDate) === sessionDate || !session.session_date)
      .map((session: any) => {
        const gameName = String(session.game_name || "").trim().toLowerCase();

        let game: TodayPlayableSession["game"] | null = null;

        if (gameName.includes("kolkata")) {
          game = "Kolkata Fatafat";
        } else if (gameName.includes("dus")) {
          game = "Dus ka Dum";
        } else if (gameName.includes("main bazar")) {
          game = "Main Bazar";
        }

        if (!game) return null;

        return {
          id: String(session.id),
          session_code: String(session.session_code || ""),
          game_id: String(session.game_id),
          game,
          bazi_no: session.bazi_no == null ? null : Number(session.bazi_no),
          market: String(session.market || ""),
          opening_time: String(session.opening_time || ""),
          deadline_at: String(session.deadline_at || ""),
        };
      })
      .filter((session): session is TodayPlayableSession => Boolean(session));

    setTodayPlayableSessions(normalized);
    setTodaySessionsReady(true);
  } catch (error) {
    console.error("=== TODAY PLAYABLE SESSIONS LOAD ERROR ===", error);
    setTodayPlayableSessions([]);
    setTodaySessionsReady(true);
  }
};

const getKolkataHour = (date: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Number(parts.find((part) => part.type === "hour")?.value || "0");
};

const loadTodayGameResults = async () => {
  try {


    const { data, error } = await supabase.rpc("get_public_today_game_results");
    if (error) throw error;

    const normalized = (Array.isArray(data) ? data : [])
      .map((row: any) => {
        const rawGame = String(row.game_name || "").trim().toLowerCase();
        let game: TodayGameResult["game"] | null = null;

        if (rawGame.includes("kolkata")) {
          game = "Kolkata Fatafat";
        } else if (rawGame.includes("dus")) {
          game = "Dus ka Dum";
        } else if (rawGame.includes("main bazar")) {
          game = "Main Bazar";
        }

        if (!game) return null;

        return {
          session_id: String(row.session_id || ""),
          game_id: String(row.game_id || ""),
          game,
          bazi_no: row.bazi_no == null ? null : Number(row.bazi_no),
          market: String(row.market || ""),
          single_digit: Number(row.single_digit),
          patti: String(row.patti || ""),
        };
      })
      .filter(
        (row: TodayGameResult | null): row is TodayGameResult =>
          Boolean(row?.session_id)
      );

    // get_public_today_game_results() already filters to today's playable
    // declared sessions server-side. Do not query game_sessions again here:
    // guests may not have direct SELECT access to that table because of RLS.
    const todayNormalized = normalized;

    // Main Bazar results are strictly today-only. The previous-day fallback has been removed.
    // If today has no declared result for a market, getTodayGameResult() returns null ("—").
    // Do not carry any previous-day Main Bazar result into the current day.















































































    setTodayGameResults(todayNormalized);
  } catch (error) {
    console.error("=== TODAY GAME RESULTS LOAD ERROR ===", error);
    setTodayGameResults([]);
  }
};

const loadCustomerResultHistory = async () => {
  if (customerResultsLoading) return;
  setCustomerResultsLoading(true);
  setCustomerResultsError("");
  try {
    const today = new Date(`${todayDateKey}T00:00:00`);
    const dayOfWeek = today.getDay();
    const daysFromMonday = (dayOfWeek + 6) % 7;
    const currentWeekMonday = new Date(today);
    currentWeekMonday.setDate(today.getDate() - daysFromMonday);
    const historyStart = new Date(currentWeekMonday);
    historyStart.setDate(currentWeekMonday.getDate() - 29 * 7);
    const historyStartKey = getLocalDateString(historyStart);

    const { data: sessions, error: sessionsError } = await supabase
      .from("game_sessions")
      .select("id, game_id, session_date, bazi_no, market")
      .gte("session_date", historyStartKey)
      .lte("session_date", todayDateKey)
      .eq("scheduled_playable", true)
      .order("session_date", { ascending: false })
      .order("bazi_no", { ascending: true, nullsFirst: true })
      .order("market", { ascending: true });

    if (sessionsError) throw sessionsError;

    const sessionRows = Array.isArray(sessions) ? sessions : [];
    const sessionIds = sessionRows.map((row: any) => String(row.id)).filter(Boolean);
    const gameIds = Array.from(new Set(sessionRows.map((row: any) => String(row.game_id || "")).filter(Boolean)));

    const [gamesResult, ...resultBatches] = await Promise.all([
      gameIds.length
        ? supabase.from("games").select("id, game_name").in("id", gameIds)
        : Promise.resolve({ data: [], error: null }),
      ...Array.from({ length: Math.ceil(sessionIds.length / 250) }, (_, index) => {
        const batch = sessionIds.slice(index * 250, index * 250 + 250);
        return batch.length
          ? supabase
              .from("results")
              .select("session_id, single_digit, patti, status, is_current")
              .in("session_id", batch)
              .eq("is_current", true)
              .eq("status", "DECLARED")
          : Promise.resolve({ data: [], error: null });
      }),
    ]);

    if (gamesResult.error) throw gamesResult.error;
    for (const batchResult of resultBatches) {
      if (batchResult.error) throw batchResult.error;
    }

    const gameMap = new Map<string, GameName>();
    for (const game of gamesResult.data || []) {
      const raw = String(game.game_name || "").trim().toLowerCase();
      if (raw.includes("kolkata")) gameMap.set(String(game.id), "Kolkata Fatafat");
      else if (raw.includes("dus")) gameMap.set(String(game.id), "Dus ka Dum");
      else if (raw.includes("main bazar")) gameMap.set(String(game.id), "Main Bazar");
    }

    const resultMap = new Map<string, any>();
    for (const batchResult of resultBatches) {
      for (const result of batchResult.data || []) {
        resultMap.set(String(result.session_id), result);
      }
    }

    const normalized = sessionRows
      .map((session: any) => {
        const game = gameMap.get(String(session.game_id || ""));
        if (!game) return null;
        const result = resultMap.get(String(session.id));
        return {
          session_id: String(session.id),
          game_id: String(session.game_id),
          game,
          session_date: String(session.session_date || ""),
          bazi_no: session.bazi_no == null ? null : Number(session.bazi_no),
          market: String(session.market || "").trim().toUpperCase(),
          single_digit: result?.single_digit == null ? "" : String(result.single_digit),
          patti: result?.patti ? String(result.patti) : "",
        };
      })
      .filter((row): row is CustomerResultRow => Boolean(row));

    setCustomerResultRows(normalized);
  } catch (error: any) {
    console.error("=== CUSTOMER RESULT HISTORY LOAD ERROR ===", error);
    setCustomerResultRows([]);
    setCustomerResultsError(error?.message || String(error));
  } finally {
    setCustomerResultsLoading(false);
  }
};

const todayDateKey = getLocalDateString(currentTime);
const mainBazarResultCycleKey =
  getKolkataHour(currentTime) >= 2 ? "AFTER_2AM" : "BEFORE_2AM";

useEffect(() => {
  if (!authReady || customerPage !== "result") return;

  void loadCustomerResultHistory();
  const timer = setInterval(() => {
    void loadCustomerResultHistory();
  }, 30000);

  return () => clearInterval(timer);
}, [authReady, customerPage, todayDateKey]);

useEffect(() => {
  if (!authReady) return;

  // Clear the previous cycle immediately. This prevents a prior-day Main Bazar
  // result from remaining visible while the new 2:00 AM cycle is loading.
  if (mainBazarResultCycleKey === "AFTER_2AM") {
    setTodayGameResults([]);
  }
  void loadTodayGameResults();

  const timer = setInterval(() => {
    void loadTodayGameResults();
  }, 30000);

  return () => clearInterval(timer);
}, [todayDateKey, mainBazarResultCycleKey, authReady]);

useEffect(() => {
  if (!authReady) return;

  setTodaySessionsReady(false);
  void loadTodayPlayableSessions(todayDateKey);

  const timer = setInterval(() => {
    void loadTodayPlayableSessions(todayDateKey);
  }, 30000);

  return () => clearInterval(timer);
}, [todayDateKey, authReady]);




/* =========================================================


TIME HELPERS


========================================================= */




const getTodayGameResult = (
  game: TodayGameResult["game"],
  bazi: number | null = null,
  market = ""
) => {
  return (
    todayGameResults.find((result) => {
      if (result.game !== game) return false;
      if (game === "Main Bazar") {
        return result.market.toUpperCase() === market.toUpperCase();
      }
      return result.bazi_no === bazi;
    }) || null
  );
};

const formatTodayResult = (result: TodayGameResult | null) => {
  if (!result) return "—";
  return `${result.patti} - ${result.single_digit}`;
};

/* =========================================================


DAY-WISE GAME RULES




Monday = 1


Tuesday = 2


Wednesday = 3


Thursday = 4


Friday = 5


Saturday = 6


Sunday = 0


========================================================= */




const dayNumber = currentTime.getDay();


const isGameAvailableToday = (
  game: string,
  bazi: number | null = null,
  market = ""
) => {
  return todayPlayableSessions.some((session) => {
    if (session.game !== game) return false;
    if (game === "Main Bazar") {
      return session.market.toUpperCase() === market.toUpperCase();
    }
    return session.bazi_no === bazi;
  });
};

const getSessionStatus = (
  game: string,
  bazi: number | null = null,
  market = ""
) => {
  const session = todayPlayableSessions.find((item) => {
    if (item.game !== game) return false;

    if (game === "Main Bazar") {
      return item.market.toUpperCase() === market.toUpperCase();
    }

    return item.bazi_no === bazi;
  });

  if (!session || !session.opening_time || !session.deadline_at) {
    return "LOCKED";
  }

  const nowMs = Date.now();
  const deadlineMs = new Date(session.deadline_at).getTime();

  return isBetAnalyzerSessionStarted(session) && nowMs < deadlineMs
    ? "RUNNING"
    : "LOCKED";
};








/* =========================================================

AUTH HELPERS — SUPABASE EMAIL/PASSWORD

========================================================= */

const closeModal = () => {
setShowLogin(false);
setShowSignup(false);
setEmail("");
setLoginIdentifier("");
setSignupUsername("");
setName("");
setConfirmPassword("");
setAuthMessage("");
setAuthError("");
};

const openLogin = () => {
setShowLogin(true);
setShowSignup(false);
setLoginIdentifier("");
setEmail("");
setPassword("");
setAuthMessage("");
setAuthError("");
};

const openSignup = () => {
setShowSignup(true);
setShowLogin(false);
setLoginIdentifier("");
setEmail("");
setSignupUsername("");
setName("");
setPassword("");
setConfirmPassword("");
setAuthMessage("");
setAuthError("");
};

const loadCustomerAccount = async (userId: string) => {

try {
const { data: profile, error: profileError } = await supabase
.from("profiles")
.select("id, role, full_name, mobile")
.eq("id", userId)
.eq("role", "CUSTOMER")
.maybeSingle();

if (profileError) {
throw profileError;
}

if (!profile) {
throw new Error("Customer profile was not found.");
}

const { data: customer, error: customerError } = await supabase
.from("customers")
.select("id, profile_id, status")
.eq("profile_id", userId)
.eq("status", "ACTIVE")
.maybeSingle();

if (customerError) {
throw customerError;
}

if (!customer) {
throw new Error("Customer account was not found.");
}

const { data: wallet, error: walletError } = await supabase
.from("wallets")
.select("id, available_balance, exposure_balance, status")
.eq("owner_profile_id", userId)
.maybeSingle();

if (walletError) {
throw walletError;
}

if (!wallet) {
throw new Error("Customer wallet was not found.");
}

if (wallet.status !== "ACTIVE") {
throw new Error("Customer wallet is not active.");
}

setCustomerProfileId(profile.id);
setCustomerId(customer.id);
setWalletId(wallet.id);
setWalletBalance(Number(wallet.available_balance || 0));
setExposureBalance(Number(wallet.exposure_balance || 0));

await loadCustomerHistoryAndStatement(customer.id, wallet.id);

return {
profile,
customer,
wallet,
};
} finally {
}
};


const refreshCustomerDashboard = async () => {
  if (customerRefreshLoading) return;

  setCustomerRefreshLoading(true);
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const user = userData.user;
    if (!user) throw new Error("Your session has expired. Please log in again.");

    await loadAuthenticatedAccount(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to refresh account.";
    if (message === "INACTIVE_ACCOUNT") {
      setIsLoggedIn(false);
      setUserRole("CUSTOMER");
      setAuthError("INACTIVE ACCOUNT — This account is not active.");
      window.alert("INACTIVE ACCOUNT\n\nThis account is not active.");
      await supabase.auth.signOut();
    } else {
      setAuthError(message || "Unable to refresh account.");
    }
  } finally {
    setCustomerRefreshLoading(false);
  }
};


const loadCustomerHistoryAndStatement = async (customerId: string, walletId: string) => {
  const cutoffIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const { data: bets, error: betsError } = await supabase
      .from("bets")
      .select("id, session_id, total_stake, status, submitted_at, created_at")
      .eq("customer_id", customerId)
      .gte("created_at", cutoffIso)
      .order("created_at", { ascending: false });
    if (betsError) throw betsError;

    const betRows = bets || [];
    const betIds = betRows.map((bet) => bet.id);
    const sessionIds = Array.from(new Set(betRows.map((bet) => bet.session_id).filter(Boolean)));

    const { data: betItems, error: betItemsError } = betIds.length
      ? await supabase
          .from("bet_items")
          .select("id, bet_id, session_id, bet_type, played_number, stake, rate, potential_win, status, created_at")
          .in("bet_id", betIds)
          .order("created_at", { ascending: false })
      : { data: [], error: null };
    if (betItemsError) throw betItemsError;


    const { data: sessions, error: sessionsError } = sessionIds.length
      ? await supabase
          .from("game_sessions")
          .select("id, session_code, game_id, session_date, bazi_no, market")
          .in("id", sessionIds)
      : { data: [], error: null };
    if (sessionsError) throw sessionsError;

    const gameIds = Array.from(new Set((sessions || []).map((session) => session.game_id).filter(Boolean)));
    const { data: games, error: gamesError } = gameIds.length
      ? await supabase.from("games").select("id, game_name").in("id", gameIds)
      : { data: [], error: null };
    if (gamesError) throw gamesError;

    const { data: results, error: resultsError } = sessionIds.length
      ? await supabase
          .from("results")
          .select("session_id, single_digit, patti, status, is_current")
          .in("session_id", sessionIds)
          .eq("is_current", true)
          .eq("status", "DECLARED")
      : { data: [], error: null };
    if (resultsError) throw resultsError;

    const betById = new Map(betRows.map((bet) => [bet.id, bet]));
    const sessionById = new Map((sessions || []).map((session) => [session.id, session]));
    const gameById = new Map((games || []).map((game) => [game.id, game]));
    const resultBySessionId = new Map((results || []).map((result) => [result.session_id, result]));

    const formatDate = (value: string | null | undefined) =>
      value ? new Date(value).toLocaleDateString("en-IN") : "-";
    const formatTime = (value: string | null | undefined) =>
      value ? new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "-";
    const normalizeBetStatus = (itemStatus: string, betStatus: string) => {
      if (itemStatus === "WON") return "WON";
      if (itemStatus === "LOST") return "LOST";
      if (itemStatus === "REFUNDED") return "REFUNDED";
      if (itemStatus === "REVERSED") return "REVERSED";
      if (betStatus === "CANCELLED") return "CANCELLED";
      return betStatus === "SETTLED" ? "SETTLED" : "PENDING";
    };

    const historyRows: BetHistoryItem[] = (betItems || []).map((item, index) => {
      const bet = betById.get(item.bet_id);
      const session = sessionById.get(item.session_id || bet?.session_id);
      const game = session ? gameById.get(session.game_id) : null;
      const result = session ? resultBySessionId.get(session.id) : null;

      return {
        id: index + 1,
        date: formatDate(item.created_at || bet?.created_at),
        time: formatTime(item.created_at || bet?.created_at),
        game: game?.game_name || "Unknown Game",
         sessionCode: session?.session_code || "-",
        market: session?.market || "-",
        bazi: session?.bazi_no !== null && session?.bazi_no !== undefined ? `Bazi ${session.bazi_no}` : "-",
        type: item.bet_type,
        number: item.played_number,
        amount: Number(item.stake || 0),
         rate: Number(item.rate || 0),
        status: normalizeBetStatus(item.status, bet?.status || "ACTIVE"),
        result: result ? `${result.patti} - ${result.single_digit}` : "-",
        wonAmount:
          normalizeBetStatus(item.status, bet?.status || "ACTIVE") === "WON"
            ? Number(item.potential_win || 0)
            : 0,
      };
    });

    setBetHistory(historyRows);

    const { data: transactions, error: transactionsError } = await supabase
      .from("wallet_transactions")
      .select("id, transaction_type, reference_type, amount, available_after, created_at")
      .eq("wallet_id", walletId)
      .in("reference_type", [
        "SUPER_ADMIN_ONLINE_CUSTOMER_TRANSFER",
        "AGENT_CUSTOMER_TRANSFER",
      ])
      .in("transaction_type", ["DEPOSIT", "WITHDRAWAL"])
      .gte("created_at", cutoffIso)
      .order("created_at", { ascending: false });
    if (transactionsError) throw transactionsError;

    const statementRows: StatementItem[] = (transactions || []).map((tx, index) => {
      const transactionType = String(tx.transaction_type || "").toUpperCase();
      const referenceType = String(tx.reference_type || "").toUpperCase();

      return {
        id: index + 1,
        date: formatDate(tx.created_at),
        time: formatTime(tx.created_at),
        type: transactionType === "DEPOSIT" ? "CREDIT" : "DEBIT",
        performedBy:
          referenceType === "SUPER_ADMIN_ONLINE_CUSTOMER_TRANSFER"
            ? "SUPER ADMIN"
            : "AGENT ADMIN",
        amount: Number(tx.amount || 0),
        balance: Number(tx.available_after || 0),
      };
    });

    setStatement(statementRows);
    setStatementPage(1);
  } catch (error) {
    console.error("=== CUSTOMER HISTORY/STATEMENT LOAD ERROR ===", error);

    setBetHistory([]);
    setStatement([]);
    throw error;
  }
};

const createAccount = async () => {
setAuthError("");
setAuthMessage("");
const cleanUsername = signupUsername.trim().toLowerCase();
const cleanEmail = email.trim().toLowerCase();

if (!cleanUsername) {
setAuthError("Username is required.");
return;
}
if (cleanUsername.length < 3 || cleanUsername.length > 50 || !/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(cleanUsername)) {
setAuthError("Username must be 3–50 characters and use only letters, numbers, dot, underscore or hyphen.");
return;
}
if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
setAuthError("Please enter a valid email address.");
return;
}
if (password.length < 8 || password.length > 16) {
setAuthError("Password must be 8 to 16 characters.");
return;
}
if (password !== confirmPassword) {
setAuthError("Passwords do not match.");
return;
}

const { error } = await supabase.auth.signUp({
email: cleanEmail,
password,
options: {
 data: { username: cleanUsername, full_name: name.trim() || null, role: "CUSTOMER" },
},
});

if (error) {
setAuthError(error.message);
return;
}

setAuthMessage("Account created. Please check your email and confirm your email address before logging in.");
};

const loginUser = async () => {
setAuthError("");
setAuthMessage("");
const identifier = loginIdentifier.trim().toLowerCase();

if (!identifier) {
setAuthError("Username or email address is required.");
return;
}

if (password.length < 8 || password.length > 16) {
setAuthError("Password must be 8 to 16 characters.");
return;
}

const { data: resolvedEmail, error: resolveError } = await supabase.rpc("resolve_login_email", {
  p_login: identifier,
});

if (resolveError) {
setAuthError(resolveError.message === "LOGIN_ACCOUNT_NOT_FOUND" ? "Username or email address was not found." : resolveError.message);
return;
}

const authEmail = String(Array.isArray(resolvedEmail) ? resolvedEmail[0] : resolvedEmail || "").trim().toLowerCase();
if (!authEmail) {
setAuthError("Unable to resolve the login account.");
return;
}

const { data, error } = await supabase.auth.signInWithPassword({
email: authEmail,
password,
});

if (error) {
setAuthError(error.message);
return;
}

const user = data.user;
setCustomerPage("home");
setCustomerName(
(user?.user_metadata?.full_name as string) ||
name.trim() ||
user?.email?.split("@")[0] ||
"Customer"
);
setCustomerEmail(user?.email || authEmail);

try {
await loadAuthenticatedAccount(user);
setIsLoggedIn(true);
} catch (accountError) {
const message = accountError instanceof Error ? accountError.message : "";
if (message === "INACTIVE_ACCOUNT") {
  setIsLoggedIn(false);
  setUserRole("CUSTOMER");
  setAuthError("INACTIVE ACCOUNT — This account is not active.");
  window.alert("INACTIVE ACCOUNT\n\nThis account is not active.");
  await supabase.auth.signOut();
} else {
  setIsLoggedIn(false);
  setAuthError(message || "Unable to load account.");
  await supabase.auth.signOut();
}
return;
}

setShowLogin(false);
setShowSignup(false);
setLoginIdentifier("");
setEmail("");
setPassword("");
setAuthMessage("");
setAuthError("");
};

const verifyCurrentPasswordAndUpdate = async (force = false) => {
setPasswordResetError("");
setPasswordResetSuccess("");
if (passwordResetLoading) return;
if (!passwordResetCurrent) return setPasswordResetError("Current Password is required.");
if (passwordResetNew.length < 8 || passwordResetNew.length > 16) return setPasswordResetError("New Password must be 8 to 16 characters.");
if (passwordResetNew !== passwordResetConfirm) return setPasswordResetError("New Passwords do not match.");
if (passwordResetNew === passwordResetCurrent) return setPasswordResetError("New Password must be different from Current Password.");

setPasswordResetLoading(true);
try {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const currentUser = userData.user;
  if (!currentUser?.email) throw new Error("AUTHENTICATION_REQUIRED");

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: currentUser.email,
    password: passwordResetCurrent,
  });
  if (verifyError) throw new Error("CURRENT_PASSWORD_INVALID");

  const { error: updateError } = await supabase.auth.updateUser({ password: passwordResetNew });
  if (updateError) throw updateError;

  const { error: completeError } = await supabase.rpc("complete_my_password_change");
  if (completeError) throw completeError;

  setPasswordResetCurrent("");
  setPasswordResetNew("");
  setPasswordResetConfirm("");
  setPasswordResetSuccess(force ? "Password updated successfully. You can now continue to your dashboard." : "Password updated successfully.");
  if (force) setForcePasswordReset(false);
} catch (error: any) {
  const message = error?.message || String(error);
  setPasswordResetError(message === "CURRENT_PASSWORD_INVALID" ? "Current Password is incorrect." : message);
} finally {
  setPasswordResetLoading(false);
}
};

const loadAuthenticatedAccount = async (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
const { data: profileRows, error: profileError } = await supabase.rpc("get_my_auth_profile");
if (profileError) throw profileError;
const profile = Array.isArray(profileRows) ? profileRows[0] : profileRows;
if (!profile) throw new Error("Profile was not found for the signed-in user.");
if (profile.status !== "ACTIVE") throw new Error("INACTIVE_ACCOUNT");
setForcePasswordReset(Boolean((profile as any).must_change_password));
if (profile.role === "SUPER_ADMIN") {
  setUserRole("SUPER_ADMIN");
  await loadSuperAdminDashboard();
  return;
}
if (profile.role === "AGENT_ADMIN") {
  setUserRole("AGENT_ADMIN");
  await loadAgentCustomerPage(1);
  return;
}
setUserRole("CUSTOMER");
await loadCustomerAccount(user.id);
await loadTodayPlayableSessions(getLocalDateString());
await loadTodayGameResults();
};


useEffect(() => {
let mounted = true;

supabase.auth.getSession().then(({ data }) => {
if (!mounted) return;
const user = data.session?.user;
if (!user) {
  setAuthReady(true);
  return;
}
setAuthReady(true);
setCustomerName(
(user.user_metadata?.full_name as string) ||
user.email?.split("@")[0] ||
"Customer"
);
setCustomerEmail(user.email || "");
loadAuthenticatedAccount(user).then(() => {
if (mounted) {
  setIsLoggedIn(true);
  setAuthError("");
}
}).catch(async (accountError) => {
if (!mounted) return;
const message = accountError instanceof Error ? accountError.message : "";
setIsLoggedIn(false);
if (message === "INACTIVE_ACCOUNT") {
  setUserRole("CUSTOMER");
  setAuthError("INACTIVE ACCOUNT — This account is not active.");
  window.alert("INACTIVE ACCOUNT\n\nThis account is not active.");
} else {
  setAuthError(message || "Unable to load account.");
}
await supabase.auth.signOut();
});
});

const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
// Email/password login is fully validated by loginUser before the dashboard is shown.
// Avoid running the same account validation twice on SIGNED_IN.
if (_event === "SIGNED_IN") return;
const user = session?.user;
if (!user) {
setIsLoggedIn(false);
setCustomerEmail("");
setBetHistory([]);
setStatement([]);
setAuthReady(true);
// Re-fetch the public home state after logout. The previous authenticated
// session can otherwise leave stale session/result data in React state.
setTodaySessionsReady(false);
void loadTodayPlayableSessions(getLocalDateString());
void loadTodayGameResults();
return;
}
setCustomerName(
(user.user_metadata?.full_name as string) ||
user.email?.split("@")[0] ||
"Customer"
);
setCustomerEmail(user.email || "");
loadAuthenticatedAccount(user).then(() => {
  setIsLoggedIn(true);
  setAuthError("");
}).catch(async (accountError) => {
  const message = accountError instanceof Error ? accountError.message : "";
  setIsLoggedIn(false);
  if (message === "INACTIVE_ACCOUNT") {
    setUserRole("CUSTOMER");
    setAuthError("INACTIVE ACCOUNT — This account is not active.");
    window.alert("INACTIVE ACCOUNT\n\nThis account is not active.");
  } else {
    setAuthError(message || "Unable to load customer account.");
  }
  await supabase.auth.signOut();
});
});

return () => {
mounted = false;
authListener.subscription.unsubscribe();
};
}, []);

/* =========================================================

CUSTOMER NAVIGATION


========================================================= */




const openCustomerPage = (page: Page) => {
  setCustomerPage(page);
  if (page !== "home") setCustomerSelectedGame(null);
};

const selectCustomerGame = (game: GameName) => {
  setCustomerPage("home");
  setCustomerSelectedGame((current) => (current === game ? null : game));
};

const getGameSessionStatus = (game: GameName) => {
  if (!todaySessionsReady) return "LOADING";
  const sessions = todayPlayableSessions.filter((session) => session.game === game);
  if (sessions.length === 0) return "GAME OFF";
  return sessions.some((session) => getSessionStatus(
    game,
    session.bazi_no,
    game === "Main Bazar" ? session.market : ""
  ) === "RUNNING") ? "OPEN FOR BETTING" : "LOCKED";
};

const getGameSessionCount = (game: GameName) =>
  todayPlayableSessions.filter((session) => session.game === game).length;

const getGameScheduleLabel = (game: GameName) => {
  if (game === "Main Bazar") return "Open / Close";
  if (game === "Kolkata Fatafat") return dayNumber === 0 ? "Bazi 1–4" : "Bazi 1–8";
  return dayNumber === 0 ? "Bazi 1–5" : "Bazi 1–10";
};


const getBetTitle = () => {


if (selectedGame === "Main Bazar") {


return `Main Bazar ${selectedMarket}`;


}




return `${selectedGame} Bazi ${selectedBazi}`;


};




const getSelectedGameStatus = () => {
  return getSessionStatus(
    selectedGame,
    selectedBazi,
    selectedMarket
  );
};


const openBetting = (

game: string,


market = "",


bazi: number | null = null


) => {


const session = todayPlayableSessions.find((item) => {
  if (item.game !== game) return false;
  if (game === "Main Bazar") {
    return item.market.toUpperCase() === market.toUpperCase();
  }
  return item.bazi_no === bazi;
});

if (!session) {
  alert("This game is not available today.");
  return;
}

if (
  !session.deadline_at ||
  new Date(session.deadline_at).getTime() <= Date.now()
) {
  alert("Betting is locked for this game.");
  return;
}




setSelectedGame(game);


setSelectedMarket(market);


setSelectedBazi(bazi);




setBetType("Single");


setBetAmount(10);


setSelectedBets({});




setCustomerPage("betting");


};




const logoutCustomer = async () => {
await supabase.auth.signOut();
setIsLoggedIn(false);
setUserRole(null);
setAdminError("");
setForcePasswordReset(false);
setPasswordResetCurrent("");
setPasswordResetNew("");
setPasswordResetConfirm("");
setShowCustomerChangePassword(false);

setCustomerPage("home");

setSelectedGame("");


setSelectedMarket("");


setSelectedBazi(null);




setBetType("Single");


setBetAmount(10);


setSelectedBets({});




setExposureBalance(0);


};




/* =========================================================


BETTING LOGIC


========================================================= */




const totalSelectedStake = Object.values(


selectedBets

).reduce(


(total, amount) => total + amount,


0


);




const selectBetType = (type: BetType) => {


/*


IMPORTANT:


Only one Bet Type's pending bets are active.


Changing Single -> Patti starts a fresh Patti selection.


*/


setBetType(type);


setBetAmount(10);


setSelectedBets({});


};




const selectNumber = (number: string) => {


/*


IMPORTANT:

Same entry accumulates.




$10 on 1


+ $10 on 1


= $20 on 1


*/


setSelectedBets((previous) => ({


...previous,


[number]:


     (previous[number] || 0) +


     betAmount,


}));


};




const clearCurrentBetSelection = () => {


setSelectedBets({});


};

const removeSelectedBet = (number: string) => {
  setSelectedBets((previous) => {
    const next = { ...previous };
    delete next[number];
    return next;
  });
};

const placeVirtualBet = async () => {
if (betSubmitting) {
return;
}

if (!isLoggedIn) {
alert("Please login first.");
return;
}

if (getSelectedGameStatus() !== "RUNNING") {
alert(
"Betting is locked. The deadline has passed."
);
setCustomerPage("home");
return;
}

const entries = Object.entries(selectedBets);

if (entries.length === 0) {
alert(
"Please select at least one number/entry first."
);
return;
}

if (!customerId || !walletId) {
alert(
"Customer wallet is not ready. Please login again."
);
return;
}

const total = entries.reduce(
(sum, [, amount]) => sum + amount,
0
);

if (total <= 0) {
alert("Invalid total stake.");
return;
}

if (total > walletBalance) {
alert(
"Insufficient virtual wallet balance."
);
return;
}

setBetSubmitting(true);

try {
const now = new Date();

const session = todayPlayableSessions.find((item) => {
if (item.game !== selectedGame) return false;

if (selectedGame === "Main Bazar") {
return (
item.market.toUpperCase() ===
selectedMarket.toUpperCase()
);
}

return item.bazi_no === selectedBazi;
});

if (!session) {
throw new Error("Today's game session was not found.");
}

if (
!session.deadline_at ||
new Date(session.deadline_at).getTime() <= Date.now()
) {
throw new Error(
"Betting deadline has passed for this session."
);
}

const items = entries.map(([number, amount]) => ({
bet_type: betType,
played_number: number,
stake: amount,
rate: betRates[betType],
}));

const {
data: rpcData,
error: rpcError,
} = await supabase.rpc(
"submit_customer_bet",
{
p_customer_id: customerId,
p_session_id: session.id,
p_performed_by: customerProfileId,
p_items: items,
}
);

if (rpcError) {
throw rpcError;
}

const result = Array.isArray(rpcData)
? rpcData[0]
: rpcData;

if (!result) {
throw new Error("Bet submission returned no result.");
}

const newBalance =
Number(result.available_balance || 0);

const newExposure =
Number(result.exposure_balance || 0);

setWalletBalance(newBalance);
setExposureBalance(newExposure);

const date = now.toLocaleDateString("en-IN");
const time = now.toLocaleTimeString(
"en-IN",
{
hour: "2-digit",
minute: "2-digit",
}
);

const newHistoryItems = entries.map(
([number, amount], index) => ({
id: Date.now() + index,
date,
time,
game: selectedGame,
sessionCode: session.session_code || "-",
market:
selectedMarket || "-",
bazi:
selectedBazi !== null
? `Bazi ${selectedBazi}`
: "-",
type: betType,
number,
amount,
rate: Number(betRates[betType] || 0),
status: "PENDING",
result: "-",
wonAmount: 0,
})
);

setBetHistory(
(previous) => [
...newHistoryItems,
...previous,
]
);


alert(
`Bet placed successfully.\n\n` +
`Game: ${getBetTitle()}\n` +
`Type: ${betType}\n` +
`Total Stake: $${total.toFixed(2)}`
);

setSelectedBets({});
} catch (error) {
const message =
error instanceof Error
? error.message
: "Unable to place bet.";

alert(`Bet could not be placed.\n\n${message}`);
} finally {
setBetSubmitting(false);
}
};

/* =========================================================

BETTING ENTRY DATA


========================================================= */




const singleNumbers = [


"0",


"1",


"2",


"3",


"4",


"5",


"6",


"7",


"8",


"9",


];




const jodiNumbers = useMemo(


() =>


Array.from(

     { length: 100 },


     (_, index) =>


     index


     .toString()


     .padStart(2, "0")


),


[]


);


const isJodiDisabled =


selectedGame ===


"Kolkata Fatafat"


? selectedBazi === 8


: selectedGame ===


"Dus ka Dum"


? selectedBazi === 10


: selectedGame ===


"Main Bazar"


? selectedMarket === "CLOSE"

: false;




const renderPublicGameCards = () => (
  <div className="public-game-selector-grid">
    {(["Main Bazar", "Kolkata Fatafat", "Dus ka Dum"] as GameName[]).map((game) => {
      const status = getGameSessionStatus(game);
      const count = getGameSessionCount(game);
      const isSelected = publicSelectedGame === game;
      return (
        <Fragment key={game}>
          <button type="button" className={`public-game-selector ${isSelected ? "selected" : ""}`} onClick={() => setPublicSelectedGame((current) => (current === game ? null : game))}>
            <div className="public-game-selector-top">
              <span className={`public-game-selector-icon ${game === "Main Bazar" ? "main" : game === "Kolkata Fatafat" ? "kolkata" : "dus"}`}>
                {game === "Main Bazar" ? "♛" : game === "Kolkata Fatafat" ? "♜" : "🎲"}
              </span>
              <span className={`public-game-selector-status ${status === "OPEN FOR BETTING" ? "open" : status === "LOCKED" ? "locked" : "off"}`}>{status}</span>
            </div>
            <strong>{game}</strong>
            <span>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <small>{status === "LOADING" ? "Checking today's sessions..." : status === "GAME OFF" ? "No session scheduled today" : `${count} session${count === 1 ? "" : "s"} • ${getGameScheduleLabel(game)}`}</small>
          </button>
          {isSelected ? renderPublicSelectedGame() : null}
        </Fragment>
      );
    })}
  </div>
);

const renderPublicMainMarket = (market: string, deadline: string) => {
  const available = isGameAvailableToday("Main Bazar", null, market);
  const running = getSessionStatus("Main Bazar", null, market) === "RUNNING";
  return (
    <div className="public-session-card">
      <div className="public-session-top"><strong>{market}</strong><span>Deadline {deadline}</span></div>
      <div className={running ? "public-session-status open" : available ? "public-session-status locked" : "public-session-status off"}>
        {running ? <><span className="green-dot" /> OPEN FOR BETTING</> : available ? "LOCKED" : "GAME OFF"}
      </div>
      <div className="result-line">Result: <span className="result-value">{formatTodayResult(getTodayGameResult("Main Bazar", null, market))}</span></div>
      {running ? <button className="play-btn" onClick={openLogin}>LOGIN TO PLAY</button> : null}
    </div>
  );
};

const renderPublicBazi = (game: "Kolkata Fatafat" | "Dus ka Dum", bazi: { no: number; time: string }) => {
  const available = isGameAvailableToday(game, bazi.no);
  const running = getSessionStatus(game, bazi.no) === "RUNNING";
  return (
    <div className="public-session-card">
      <div className="public-session-top"><strong>Bazi {bazi.no}</strong><span>{bazi.time}</span></div>
      <div className={running ? "public-session-status open" : available ? "public-session-status locked" : "public-session-status off"}>
        {running ? <><span className="green-dot" /> OPEN FOR BETTING</> : available ? "LOCKED" : "GAME OFF"}
      </div>
      <div className="result-line">Result: <span className="result-value">{formatTodayResult(getTodayGameResult(game, bazi.no))}</span></div>
      {running ? <button className="play-btn" onClick={openLogin}>LOGIN TO PLAY</button> : null}
    </div>
  );
};

const renderPublicSelectedGame = () => {
  if (!publicSelectedGame) return null;
  const game = publicSelectedGame;
  const configuredKolkata = dayNumber === 0 ? kolkataBazi.slice(0, 4) : kolkataBazi;
  const configuredDus = dayNumber === 0 ? dusBazi.slice(0, 5) : dusBazi;
  return (
    <section className="public-selected-game-card">
      {game === "Main Bazar" ? (
        <div className="public-session-grid">{mainBazarMarkets.map((market) => renderPublicMainMarket(market.market, market.time))}</div>
      ) : game === "Kolkata Fatafat" ? (
        <div className="public-session-grid">{configuredKolkata.map((bazi) => renderPublicBazi("Kolkata Fatafat", bazi))}</div>
      ) : (
        <div className="public-session-grid">{configuredDus.map((bazi) => renderPublicBazi("Dus ka Dum", bazi))}</div>
      )}
    </section>
  );
};

/* =========================================================


HEADER


========================================================= */




const renderCustomerHeader = () => (


<header className="customer-header">


<div className="customer-header-inner">


<div className="brand-lockup">
<span className="brand-crown">♛</span>
<div>
<div className="customer-brand"><span className="brand-light">APNA</span> MATKA</div>
<div className="customer-subtitle">VIRTUAL USD COIN GAMES</div>
</div>
</div>
<div className="customer-header-balances">
  <div><span>WALLET</span><strong>${walletBalance.toFixed(2)}</strong></div>
  <div><span>EXPOSURE</span><strong>${exposureBalance.toFixed(2)}</strong></div>
</div>
<div className="customer-header-actions">
<button
className="customer-refresh-btn"
type="button"
onClick={refreshCustomerDashboard}
disabled={customerRefreshLoading}
aria-label="Refresh"
>
{customerRefreshLoading ? "..." : "↻"}
</button>
<button
className="profile-mini-btn"
type="button"
onClick={() => openCustomerPage("profile")}
aria-label="Profile"
title="Profile"
>
👤
</button>
</div>


</div>


</header>


);




/* =========================================================


BALANCE


========================================================= */




const renderBalanceBar = () => (


<div className="balance-wrap">

<div className="balance-card">


 <div className="balance-label">


 WALLET BALANCE


 </div>




 <div className="balance-value">


 ${walletBalance.toFixed(2)}


 </div>




 <div className="balance-small">


 Virtual USD Coins


 </div>


</div>


<div className="balance-card exposure">


 <div className="balance-label">


 EXPOSURE BALANCE


 </div>




 <div className="balance-value">

     ${exposureBalance.toFixed(2)}


     </div>




     <div className="balance-small">


     Active Bets


     </div>


</div>


</div>


);




/* =========================================================


CUSTOMER NAV


========================================================= */




const renderCustomerNav = () => (


<div className="customer-nav">


<button


     className={

    customerPage === "home"


        ? "customer-nav-btn active"


        : "customer-nav-btn"


    }


    onClick={() =>


openCustomerPage("home")


}


>


Home


</button>




<button


className={


customerPage === "history"


    ? "customer-nav-btn active"


    : "customer-nav-btn"


}


onClick={() =>


openCustomerPage("history")

}


>


History


</button>




<button
className={
  customerPage === "result"
    ? "customer-nav-btn active"
    : "customer-nav-btn"
}
onClick={() => openCustomerPage("result")}
>
  Result
</button>


</div>

);




/* =========================================================


MAIN BAZAR CARD


========================================================= */




const renderMainMarket = (


market: string,


deadline: string


) => {


const available =
isGameAvailableToday(
     "Main Bazar",
     null,
     market
);




const status = getSessionStatus(
  "Main Bazar",
  null,
  market
);

const running =


status === "RUNNING";




return (


<button


    className={


    running


    ? "customer-market running"


    : "customer-market locked"


}


disabled={!running}


onClick={() => {


if (running) {


    openBetting(


    "Main Bazar",


    market,


    null


    );

}


}}


>


<div className="customer-market-top">


<span>{market}</span>







</div>


     <div className="customer-deadline">

Deadline: {deadline}


</div>




<div


className={


running


    ? "customer-running"


    : "customer-locked"


}


>


{running ? (


<>


    <span className="green-dot" />


    OPEN FOR BETTING


</>


) : available ? (


"BETTING CLOSED"


):(

     "GAME OFF"


     )}


     </div>


     <div className="customer-result-line">
     <span>RESULT</span>
     <strong>{formatTodayResult(getTodayGameResult("Main Bazar", null, market))}</strong>
     </div>

{running && (
  <div className="customer-play-action">
    TAP TO PLAY
  </div>
)}


</button>


);


};




/* =========================================================


BAZI CARD


========================================================= */


const renderBaziBox = (


game: TodayGameResult["game"],


bazi: {


no: number;


time: string;


}

) => {


const available =


isGameAvailableToday(


 game,


 bazi.no


);




const running =
  getSessionStatus(
    game,
    bazi.no
  ) === "RUNNING";




return (


<button


 className={


 running


     ? "customer-bazi-box running"


     : "customer-bazi-box locked"

    }


    disabled={!running}


    onClick={() => {


    if (running) {


    openBetting(


     game,


     "",


     bazi.no


    );


}


}}


>


<div className="customer-bazi-top">


<span className="customer-bazi-number">


    Bazi {bazi.no}


</span>




<span className="customer-bazi-time">

    {bazi.time}


</span>


</div>




<div


className={


    running


    ? "customer-bazi-status"


    : "customer-bazi-status locked-text"


}


>


{running ? (


    <>


    <span className="green-dot" />


    OPEN FOR BETTING


    </>


    ) : available ? (


    "LOCKED"


    ):(

     "GAME OFF"


     )}


     </div>




     <div className="customer-result-line">
     <span>RESULT</span>
     <strong>{formatTodayResult(getTodayGameResult(game, bazi.no))}</strong>
     </div>


     {running ? (
      <div className="customer-bazi-action customer-play-action">
        TAP TO PLAY
      </div>
      ) : (
      <div className="customer-bazi-action">
        {available ? "BETTING CLOSED" : "NOT AVAILABLE TODAY"}
      </div>
      )}


</button>


);


};




/* =========================================================

CUSTOMER HOME


========================================================= */




const renderCustomerGameCards = () => (
  <div className="customer-game-selector-grid">
    {(["Main Bazar", "Kolkata Fatafat", "Dus ka Dum"] as GameName[]).map((game) => {
      const status = getGameSessionStatus(game);
      const count = getGameSessionCount(game);
      const isSelected = customerSelectedGame === game;
      return (
        <Fragment key={game}>
          <button type="button" className={`customer-game-selector ${isSelected ? "selected" : ""}`} onClick={() => selectCustomerGame(game)}>
            <div className="customer-game-selector-top">
              <span className={`customer-game-selector-icon ${game === "Main Bazar" ? "main" : game === "Kolkata Fatafat" ? "kolkata" : "dus"}`}>
                {game === "Main Bazar" ? "♛" : game === "Kolkata Fatafat" ? "♜" : "🎲"}
              </span>
              <span className={`customer-game-selector-status ${status === "OPEN FOR BETTING" ? "open" : status === "LOCKED" ? "locked" : "off"}`}>{status}</span>
            </div>
            <strong>{game}</strong>
            <span>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <small>{status === "LOADING" ? "Checking today's sessions..." : status === "GAME OFF" ? "No session scheduled today" : `${count} session${count === 1 ? "" : "s"} • ${getGameScheduleLabel(game)}`}</small>
          </button>
          {isSelected ? renderCustomerSelectedGame() : null}
        </Fragment>
      );
    })}
  </div>
);

const renderCustomerSelectedGame = () => {
  if (!customerSelectedGame) return null;
  const game = customerSelectedGame;
  const configuredKolkata = dayNumber === 0 ? kolkataBazi.slice(0, 4) : kolkataBazi;
  const configuredDus = dayNumber === 0 ? dusBazi.slice(0, 5) : dusBazi;

  return (
    <section className="customer-selected-game-card">
      {game === "Main Bazar" ? (
        <div className="customer-main-grid">{mainBazarMarkets.map((market) => renderMainMarket(market.market, market.time))}</div>
      ) : game === "Kolkata Fatafat" ? (
        <div className="customer-bazi-grid">{configuredKolkata.map((bazi) => renderBaziBox("Kolkata Fatafat", bazi))}</div>
      ) : (
        <div className="customer-bazi-grid">{configuredDus.map((bazi) => renderBaziBox("Dus ka Dum", bazi))}</div>
      )}
    </section>
  );
};

const renderCustomerHome = () => (
  <>
    {renderCustomerHeader()}
    <main className="customer-main">
      <div className="customer-welcome">
        <div>
          <div className="customer-welcome-title">Welcome, {customerName}</div>
          <div className="customer-welcome-sub">Select a game to view its sessions and start your virtual play.</div>
        </div>
        <div className="customer-live">LIVE</div>
      </div>
      {renderCustomerNav()}
      <div className="customer-section-title">TODAY'S GAMES</div>
      {renderCustomerGameCards()}
      <div className="customer-notice">
        <div className="customer-notice-responsible">♜ &nbsp; Play Responsibly &nbsp; | &nbsp; 18+ Only &nbsp; | &nbsp; Virtual USD Coin Games</div>
        Virtual USD coin game only.<br />
        No customer Deposit or Withdrawal option is available in this customer interface.
      </div>
      <div className="customer-bottom-nav">
        <button onClick={() => openCustomerPage("home")}>Home</button>
        <button onClick={() => openCustomerPage("history")}>History</button>
        <button onClick={() => openCustomerPage("result")}>Result</button>
      </div>
    </main>
    {renderCustomerFooter()}
  </>
);

/* =========================================================


ENTRY BUTTON


========================================================= */

const renderEntryButton = (


number: string


) => {


const amount =


selectedBets[number] || 0;




return (


<button


key={number}


className={


amount > 0


    ? "number-btn selected has-bet-amount"


    : "number-btn"


}


onClick={() =>


selectNumber(number)


}

>


<span>{number}</span>




{amount > 0 && (


<small>


     ${amount.toFixed(0)}


</small>


)}


</button>


);


};




/* =========================================================


PATTI GROUP


========================================================= */




const renderPattiGroup = (


ank: number,


entries: string[]

) => (


<div


className="patti-group"


key={ank}


>


<div className="patti-group-title">


     ANK {ank}


</div>




<div className="patti-grid">


     {entries.map(


     renderEntryButton


     )}


</div>


</div>


);




/* =========================================================

SELECTED BET SUMMARY


========================================================= */




const renderSelectedBetSummary = () => {


const entries =


Object.entries(


selectedBets


);




return (


<div className="selected-bets-panel">


<div className="selected-bets-title">


SELECTED{" "}


{betType.toUpperCase()} BETS


</div>




{entries.length === 0 ? (


<div className="selected-bets-empty">


 No selections yet.

 Select numbers above.


</div>


):(


<div className="selected-bets-list">


{entries.map(


 ([number, amount]) => (


 <div


      className="selected-bet-row"


      key={number}


 >


      <span className="selected-bet-number">


      {number}


      </span>




      <strong>


      ${amount.toFixed(2)}


      </strong>

      <button
        type="button"
        className="selected-bet-remove"
        aria-label={`Remove ${number}`}
        onClick={() => removeSelectedBet(number)}
      >
        ×
      </button>


 </div>

     )


)}


</div>


)}




<div className="selected-bets-total">


<span>


Total Stake


</span>




<strong>


$


{totalSelectedStake.toFixed(


     2


)}


     </strong>


     </div>

</div>


);


};




/* =========================================================


BETTING PAGE


========================================================= */




const renderBettingPage = () => {


const rate =


betRates[betType];




const selectedEntries =


Object.entries(


selectedBets


);




const status =


getSelectedGameStatus();

return (


<>


{renderCustomerHeader()}




<main className="customer-main">


<div className="betting-topbar">


 <button


 className="back-btn"


 onClick={() =>


 openCustomerPage(


     "home"


 )


 }


 >


 ← Back

 </button>




 <div className="betting-title">


 Betting


 </div>


<div className="betting-balance">


$


{walletBalance.toFixed(


0


)}


</div>


</div>




<section className="betting-card">


{/* CONTEXT */}




<div className="betting-context">


<div className="context-game-row">


<span className={`context-game-icon ${selectedGame === "Main Bazar" ? "main" : selectedGame === "Kolkata Fatafat" ? "kolkata" : "dus"}`} aria-hidden="true">
  {selectedGame === "Main Bazar" ? "♛" : selectedGame === "Kolkata Fatafat" ? "♜" : "🎲"}
</span>


<div className="context-value">


{getBetTitle()}


</div>


<div className="context-date">


{new Date(`${todayDateKey}T00:00:00`).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}


</div>


</div>




<div


className={


status === "RUNNING"


    ? "betting-live-status running-status"


    : "betting-live-status locked-status"


}


>


{status ===


"RUNNING"


? "● RUNNING — BETTING OPEN"


:" LOCKED — BETTING CLOSED"}


</div>

</div>




{/* BET TYPE */}




<div className="betting-section-title">


BET TYPE


</div>




<div className="bet-type-grid">


{(


[


"Single",


"Single Patti",


"Double Patti",


"Triple Patti",


"Jodi",


] as BetType[]


).filter(


(type) =>

!(


 type === "Jodi" &&


 selectedGame === "Main Bazar" &&


 selectedMarket === "CLOSE"


)


).map((type) => {


const disabled =


type === "Jodi" &&


isJodiDisabled;




return (


<button


    key={type}


    disabled={disabled}


    className={


    betType === type


     ? "bet-type-btn selected"


     : "bet-type-btn"

  }


  onClick={() => {


  if (


      !disabled


  ){


      selectBetType(


      type


      );


  }


  }}


  >


  <span className="bet-type-reference-number">
  {type === "Single" && "7"}
  {type === "Single Patti" && "123"}
  {type === "Double Patti" && "112"}
  {type === "Triple Patti" && "777"}
  {type === "Jodi" && "77"}
  </span>
  <span className="bet-type-label">{type}</span>


  </button>


);


})}

</div>




{isJodiDisabled && (


<div className="bet-warning">


Jodi is not available


for this Bazi.


</div>


)}




<div className="rate-box">


<span>


{betType} Rate (Win 1 {betType === "Single" ? "Number" : betType === "Jodi" ? "Jodi" : "Patti"})


</span>




<strong>


{rate}X


</strong>


</div>

{/* ENTRY */}




<div className="betting-section-title">


{betType === "Single Patti" ? "SELECT PATTI / ENTRY (000 – 999)" : betType === "Jodi" ? "SELECT JODI NUMBER (00 – 99)" : "SELECT NUMBER / ENTRY"}


</div>




{/* SINGLE */}




{betType ===


"Single" && (


<div className="number-grid">


{singleNumbers.map(


     renderEntryButton


)}


</div>


)}




{/* JODI */}

{betType === "Jodi" && (


<div className="number-grid jodi-grid">


{jodiNumbers.map(


     renderEntryButton


)}


</div>


)}




{/* SINGLE PATTI */}




{betType ===


"Single Patti" && (


<div className="patti-groups">


{Object.entries(


     singlePatti


).map(


     ([


     ank,

     entries,


     ]) =>


     renderPattiGroup(


     Number(ank),


     entries


     )


)}


</div>


)}




{/* DOUBLE PATTI */}


{betType ===


"Double Patti" && (


<div className="patti-groups">


{Object.entries(


     doublePatti


).map(


     ([

     ank,


     entries,


     ]) =>


     renderPattiGroup(


     Number(ank),


     entries


     )


)}


</div>


)}




{/* TRIPLE PATTI */}




{betType ===


"Triple Patti" && (


<div className="number-grid patti-triple-grid">


{triplePatti.map(


     renderEntryButton


)}

</div>


)}


{/* AMOUNT */}




<div className="betting-section-title">


SELECT AMOUNT (USD COINS)


</div>




<div className="amount-grid">


{amountOptions.map(


(amount) => (


<button


     key={amount}


     className={


     betAmount ===


     amount


     ? "amount-btn selected"


     : "amount-btn"

     }


     onClick={() =>


     setBetAmount(


         amount


     )


     }


>


     $


     {amount.toLocaleString()}


</button>


)


)}


</div>


{/* SELECTED SUMMARY */}




{renderSelectedBetSummary()}




{/* BUTTONS */}

<div className="bet-actions">


<button


className="clear-bet-btn"


onClick={


clearCurrentBetSelection


}


>


CLEAR ALL


</button>




<button


className="place-bet-btn"


disabled={


status !==


    "RUNNING" ||


selectedEntries.length ===


    0 ||


betSubmitting


}

onClick={


placeVirtualBet


}


>


{betSubmitting ? "SUBMITTING..." : status === "RUNNING" ? "SUBMIT BET" : "BETTING LOCKED"}


</button>


</div>




<div className="virtual-note">


Virtual USD coin demo.


The Total Stake will be


deducted from the demo


wallet when submitted.


</div>


</section>

<div className="customer-bottom-nav">


<button
className="selected-bottom"


onClick={() =>


openCustomerPage(


    "home"


)


}


>


Home


</button>




<button


onClick={() =>


openCustomerPage(


    "history"


    )


    }


    >

     History


     </button>




     <button


     onClick={() =>


     openCustomerPage(


         "profile"


     )


     }


     >


     Profile


     </button>


     </div>


     </main>


</>


);


};




/* =========================================================

HISTORY


========================================================= */




const renderHistoryPage = () => {

const filtered =
historyFilter === "All"
? betHistory
: betHistory.filter((bet) => {
if (historyFilter === "Main Bazar") return bet.game === "Main Bazar";
if (historyFilter === "Kolkata") return bet.game === "Kolkata Fatafat";
if (historyFilter === "Dus Ka Dum") return bet.game === "Dus Ka Dum";
return true;
});

const historyPageSize = 25;
const historyPageCount = Math.max(1, Math.ceil(filtered.length / historyPageSize));
const safeHistoryPage = Math.min(historyPage, historyPageCount);
const historyStart = (safeHistoryPage - 1) * historyPageSize;
const pagedHistory = filtered.slice(historyStart, historyStart + historyPageSize);

return (
<>
{renderCustomerHeader()}
<main className="customer-main customer-history-page">
{renderCustomerNav()}

<div className="page-heading">
<div className="page-heading-title">Bet History</div>
<div className="page-heading-sub">Your virtual game activity</div>
</div>

<div className="history-tabs">
{["All", "Main Bazar", "Kolkata", "Dus Ka Dum"].map((filter) => (
<button
key={filter}
className={historyFilter === filter ? "history-tab active" : "history-tab"}
onClick={() => {
setHistoryFilter(filter);
setHistoryPage(1);
}}
>
{filter}
</button>
))}
</div>

{filtered.length === 0 ? (
<div className="empty-card">
<div className="empty-icon">—</div>
<div className="empty-title">No Bets Yet</div>
<div className="empty-text">Your virtual betting history will appear here.</div>
<button className="empty-play-btn" onClick={() => openCustomerPage("home")}>
GO TO GAMES
</button>
</div>
) : (
<>
<div className="history-table-scroll">
<table className="history-table">
<thead>
<tr>
<th>Date &amp; Time</th>
<th>Game</th>
<th>Session</th>
<th>Bazi</th>
<th>Bet Type</th>
<th>Number / Patti / Jodi</th>
<th>Amount</th>
<th>Rate</th>
<th>Result</th>
<th>Status</th>
<th>Won Amount</th>
</tr>
</thead>
<tbody>
{pagedHistory.map((bet) => (
<tr key={bet.id}>
<td className="history-table-datetime">
<div>{bet.date}</div>
<div>{bet.time}</div>
</td>
<td className="history-table-game">{bet.game}</td>
<td className="history-table-session">{bet.sessionCode === "-" ? "-" : bet.sessionCode.slice(-10)}</td>
<td className="history-table-bazi">{bet.bazi}</td>
<td className="history-table-bet-type">{bet.type}</td>
<td className="history-table-number">{bet.number}</td>
<td className="history-table-amount">${bet.amount.toFixed(2)}</td>
<td className="history-table-rate">{bet.rate > 0 ? `${bet.rate}X` : "-"}</td>
<td className="history-table-result">{bet.result}</td>
<td><span className={`history-table-status history-table-status-${String(bet.status || "").toLowerCase()}`}>{bet.status}</span></td>
<td className="history-table-won-amount">{bet.status === "WON" ? `$${bet.wonAmount.toFixed(2)}` : "-"}</td>
</tr>
))}
</tbody>
</table>
</div>

<div className="history-pagination">
<div className="history-pagination-info">
Showing {historyStart + 1}-{Math.min(historyStart + pagedHistory.length, filtered.length)} of {filtered.length}
</div>
<div className="history-pagination-controls">
<button
type="button"
className="history-pagination-btn"
disabled={safeHistoryPage <= 1}
onClick={() => setHistoryPage((page) => Math.max(1, page - 1))}
>
PREVIOUS
</button>
<span className="history-pagination-page">Page {safeHistoryPage} of {historyPageCount}</span>
<button
type="button"
className="history-pagination-btn"
disabled={safeHistoryPage >= historyPageCount}
onClick={() => setHistoryPage((page) => Math.min(historyPageCount, page + 1))}
>
NEXT
</button>
</div>
</div>
</>
)}
</main>
</>
);
};

/* =========================================================


RESULT HISTORY


========================================================= */

const formatCustomerResultDate = (dateKey: string) => {
  if (!dateKey) return "--";
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getCustomerMainWeeks = () => {
  const today = new Date(`${todayDateKey}T00:00:00`);
  const dayOfWeek = today.getDay();
  const daysFromMonday = (dayOfWeek + 6) % 7;
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - daysFromMonday);

  return Array.from({ length: 30 }, (_, index) => {
    const monday = new Date(currentMonday);
    monday.setDate(currentMonday.getDate() - index * 7);
    return Array.from({ length: 5 }, (_, dayIndex) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + dayIndex);
      return getLocalDateString(date);
    });
  });
};

const getCustomerResultForSession = (date: string, game: GameName, bazi: number | null, market?: string) =>
  customerResultRows.find((row) =>
    row.session_date === date &&
    row.game === game &&
    (bazi == null ? row.bazi_no == null : row.bazi_no === bazi) &&
    (market ? row.market === market : true)
  ) || null;

const renderMainBazarResultCell = (date: string) => {
  const open = getCustomerResultForSession(date, "Main Bazar", null, "OPEN");
  const close = getCustomerResultForSession(date, "Main Bazar", null, "CLOSE");

  return (
    <div className="customer-result-main-cell">
      <div className="customer-result-patti customer-result-patti-left">
        {(open?.patti || "---").split("").map((digit, index) => <span key={`open-${date}-${index}`}>{digit}</span>)}
      </div>
      <div className="customer-result-main-number">
        <span>{open?.single_digit || ""}</span>
        <span>{close?.single_digit || ""}</span>
        {!open?.single_digit && !close?.single_digit ? "--" : null}
      </div>
      <div className="customer-result-patti customer-result-patti-right">
        {(close?.patti || "---").split("").map((digit, index) => <span key={`close-${date}-${index}`}>{digit}</span>)}
      </div>
    </div>
  );
};

const renderMainBazarResults = () => {
  const weeks = getCustomerMainWeeks();
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <section className="customer-result-panel">
      <div className="customer-result-table-scroll">
        <div className="customer-result-main-table">
          <div className="customer-result-main-header">
            <div>DATE</div>
            {weekdays.map((day) => <div key={day}>{day}</div>)}
          </div>
          {weeks.map((week, weekIndex) => {
            const first = week[0];
            const last = week[4];
            return (
              <div className="customer-result-main-row" key={`week-${first}`}>
                <div className="customer-result-week-date">
                  <span>{formatCustomerResultDate(first)}</span>
                  <span>to</span>
                  <span>{formatCustomerResultDate(last)}</span>
                </div>
                {week.map((date) => (
                  <div className="customer-result-main-day" key={`${weekIndex}-${date}`}>
                    {renderMainBazarResultCell(date)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const renderCustomerDailyResultCard = (game: "Kolkata Fatafat" | "Dus ka Dum", date: string) => {
  const maxBazi = game === "Kolkata Fatafat" ? 8 : 10;
  const isSunday = new Date(`${date}T00:00:00`).getDay() === 0;
  const visibleBazi = isSunday ? (game === "Kolkata Fatafat" ? 4 : 5) : maxBazi;

  return (
    <div className="customer-result-day-card" key={`${game}-${date}`}>
      <div className="customer-result-day-title">{formatCustomerResultDate(date)}</div>
      <div className={`customer-result-bazi-grid ${game === "Dus ka Dum" ? "dus-grid" : ""}`}>
        {Array.from({ length: visibleBazi }, (_, index) => {
          const bazi = index + 1;
          const result = getCustomerResultForSession(date, game, bazi);
          return (
            <div className="customer-result-bazi-box" key={`${date}-${bazi}`}>
              <div className="customer-result-bazi-label">BAZI {bazi}</div>
              <div className="customer-result-bazi-patti">{result?.patti || "--"}</div>
              <div className="customer-result-bazi-single">{result?.single_digit || "--"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderCustomerDailyResults = (game: "Kolkata Fatafat" | "Dus ka Dum") => {
  const dates = Array.from(new Set(
    customerResultRows
      .filter((row) => row.game === game)
      .map((row) => row.session_date)
  )).sort((a, b) => b.localeCompare(a)).slice(0, 30);

  return (
    <section className="customer-result-panel">
      {dates.length === 0 ? (
        <div className="customer-result-empty">No result history available yet.</div>
      ) : dates.map((date) => renderCustomerDailyResultCard(game, date))}
    </section>
  );
};

const renderResultPage = () => (
  <>
    {renderCustomerHeader()}
    <main className="customer-main customer-result-page">
      {renderCustomerNav()}
      <div className="page-heading">
        <div className="page-heading-title">Result History</div>
        <div className="page-heading-sub">Latest declared game results</div>
      </div>

      <div className="customer-result-game-tabs">
        {(["Main Bazar", "Kolkata Fatafat", "Dus ka Dum"] as GameName[]).map((game) => (
          <button
            key={game}
            type="button"
            className={customerResultGame === game ? "customer-result-game-tab active" : "customer-result-game-tab"}
            onClick={() => setCustomerResultGame(game)}
          >
            {game}
          </button>
        ))}
      </div>

      {customerResultsLoading && customerResultRows.length === 0 ? (
        <div className="customer-result-empty">Loading result history...</div>
      ) : customerResultsError ? (
        <div className="customer-result-empty">Unable to load result history.</div>
      ) : customerResultGame === "Main Bazar" ? (
        renderMainBazarResults()
      ) : customerResultGame === "Kolkata Fatafat" ? (
        renderCustomerDailyResults("Kolkata Fatafat")
      ) : customerResultGame === "Dus ka Dum" ? (
        renderCustomerDailyResults("Dus ka Dum")
      ) : (
        <div className="customer-result-empty">Select a game to view its result history.</div>
      )}
    </main>
  </>
);

/* =========================================================


PROFILE


========================================================= */




const renderProfilePage = () => (


<>


{renderCustomerHeader()}

<main className="customer-main">


 {renderBalanceBar()}
 {renderCustomerNav()}




 <div className="page-heading">


 <div className="page-heading-title">


 Profile


 </div>


<div className="page-heading-sub">


Customer account


</div>


</div>




<div className="profile-card">


<div className="profile-name">


{customerName}


</div>




<div className="profile-label">

Customer Account


</div>


<div className="profile-mobile">


Email: {customerEmail || "Not available"}


</div>


</div>




<div className="profile-menu">


<button


onClick={() =>


openCustomerPage(


    "statement"


)


}


>


<span>


Account Statement


</span>

<span>›</span>


</button>


<button


onClick={() =>


openCustomerPage(


    "history"


)


}


>


<span>


Bet History


</span>




<span>›</span>


</button>




<button
className="profile-change-password-btn"
onClick={() => { setShowCustomerChangePassword((value) => !value); setPasswordResetError(""); setPasswordResetSuccess(""); }}
>
<span>Change Password</span>
<span>{showCustomerChangePassword ? "⌃" : "›"}</span>
</button>

{showCustomerChangePassword ? (
<div className="profile-change-password-panel">
  <div className="profile-change-password-title">CHANGE PASSWORD</div>
  <input className="input" type="password" placeholder="Current Password" value={passwordResetCurrent} onChange={(e)=>setPasswordResetCurrent(e.target.value)} maxLength={16} autoComplete="current-password" />
  <input className="input" type="password" placeholder="New Password" value={passwordResetNew} onChange={(e)=>setPasswordResetNew(e.target.value)} maxLength={16} autoComplete="new-password" />
  <input className="input" type="password" placeholder="Repeat New Password" value={passwordResetConfirm} onChange={(e)=>setPasswordResetConfirm(e.target.value)} maxLength={16} autoComplete="new-password" />
  {passwordResetError ? <div className="otp-error">{passwordResetError}</div> : null}
  {passwordResetSuccess ? <div className="otp-message">{passwordResetSuccess}</div> : null}
  <button className="continue" type="button" onClick={()=>void verifyCurrentPasswordAndUpdate(false)} disabled={passwordResetLoading}>{passwordResetLoading ? "UPDATING..." : "UPDATE PASSWORD"}</button>
</div>
) : null}

<button


className="logout-btn"


onClick={logoutCustomer}

>


<span>Logout</span>




<span>›</span>


</button>


</div>

</main>


</>


);




/* =========================================================

STATEMENT


========================================================= */




const renderStatementPage = () => {
  const statementPageSize = 25;
  const statementPageCount = Math.max(1, Math.ceil(statement.length / statementPageSize));
  const safeStatementPage = Math.min(statementPage, statementPageCount);
  const statementStart = (safeStatementPage - 1) * statementPageSize;
  const pagedStatement = statement.slice(statementStart, statementStart + statementPageSize);
  const statementFrom = statement.length === 0 ? 0 : statementStart + 1;
  const statementTo = Math.min(statementStart + statementPageSize, statement.length);

  return (
<>
{renderCustomerHeader()}

<main className="customer-main customer-statement-page">

<div className="betting-topbar">
<button
className="back-btn"
onClick={() =>
openCustomerPage(
    "profile"
)
}
>
← Back
</button>

<div className="betting-title">
Statement
</div>

<div />
</div>

{statement.length === 0 ? (
<div className="empty-card">
<div className="empty-title">
No Statement Yet
</div>
<div className="empty-text">
Virtual credits and
debits will appear here.
</div>
</div>
):(
<>
<div className="statement-table-scroll">
<table className="statement-table">
<thead>
<tr>
<th className="statement-col-datetime">Date &amp; Time</th>
<th className="statement-col-by">Transaction By</th>
<th className="statement-col-type">Type</th>
<th className="statement-col-amount">Amount</th>
<th className="statement-col-balance">Available Balance</th>
</tr>
</thead>
<tbody>
{pagedStatement.map((item) => (
<tr key={item.id}>
<td className="statement-table-datetime">
<div>{item.date}</div>
<div>{item.time}</div>
</td>
<td className="statement-table-by">
{item.performedBy}
</td>
<td className="statement-table-type-cell">
<span className={`statement-table-type ${item.type === "CREDIT" ? "credit" : "debit"}`}>
{item.type}
</span>
</td>
<td className="statement-table-amount">
<span className={item.type === "CREDIT" ? "statement-table-credit" : "statement-table-debit"}>
{item.type === "CREDIT" ? "+" : "-"}${item.amount.toFixed(2)}
</span>
</td>
<td className="statement-table-balance">
${item.balance.toFixed(2)}
</td>
</tr>
))}
</tbody>
</table>
</div>

{statementPageCount > 1 && (
<div className="statement-pagination">
<div className="statement-pagination-info">
Showing {statementFrom}-{statementTo} of {statement.length}
</div>
<div className="statement-pagination-controls">
<button
className="statement-pagination-btn"
onClick={() => setStatementPage((page) => Math.max(1, page - 1))}
disabled={safeStatementPage === 1}
>
Previous
</button>
<div className="statement-pagination-page">
Page {safeStatementPage} / {statementPageCount}
</div>
<button
className="statement-pagination-btn"
onClick={() => setStatementPage((page) => Math.min(statementPageCount, page + 1))}
disabled={safeStatementPage === statementPageCount}
>
Next
</button>
</div>
</div>
)}
</>
)}

<div className="customer-bottom-nav">
<button
onClick={() =>
openCustomerPage(
    "home"
)
}
>
Home
</button>

<button
onClick={() =>
openCustomerPage(
    "history"
)
}
>
History
</button>

<button
onClick={() =>
openCustomerPage(
     "profile"
)
}
>
Profile
</button>
</div>

</main>
</>
  );
};




/* =========================================================























































































FOOTER


========================================================= */




const renderCustomerFooter = () => (

<footer className="customer-footer">
<div className="footer-responsible">♜ &nbsp; Play Responsibly &nbsp; | &nbsp; 18+ Only &nbsp; | &nbsp; Virtual USD Coin Games</div>
</footer>


);




/* =========================================================


CUSTOMER AREA

========================================================= */



const loadSuperAdminAccountDirectory = async (type: "CUSTOMER" | "AGENT") => {
  setAdminLoading(true);
  setAdminError("");
  try {
    if (type === "AGENT") {
      const { data: agentRows, error: agentError } = await supabase
        .from("agents")
        .select("id, profile_id, agent_code, status, created_at")
        .neq("status", "DELETED")
        .order("created_at", { ascending: false });
      if (agentError) throw agentError;
      const rows = agentRows || [];
      const ids = rows.map((r) => r.profile_id).filter(Boolean);
      const [pr, wr] = await Promise.all([
        ids.length ? supabase.from("profiles").select("id, username, status").in("id", ids) : Promise.resolve({data:[],error:null}),
        ids.length ? supabase.from("wallets").select("owner_profile_id, available_balance, exposure_balance, status, currency").in("owner_profile_id", ids) : Promise.resolve({data:[],error:null}),
      ]);
      if (pr.error) throw pr.error; if (wr.error) throw wr.error;
      const pm = new Map((pr.data || []).map((p) => [String(p.id), p]));
      const wm = new Map((wr.data || []).filter((w) => w.currency === "USD").map((w) => [String(w.owner_profile_id), w]));
      setSuperAdminAgentAccounts(rows.filter((r) => pm.get(String(r.profile_id))?.status !== "DELETED").map((r) => {
        const p = pm.get(String(r.profile_id)); const w = wm.get(String(r.profile_id));
        return { id:String(r.id), profile_id:String(r.profile_id), username:String(p?.username || r.agent_code || ""),
          agent_code:String(r.agent_code || ""), available_balance:Number(w?.available_balance || 0),
          exposure_balance:Number(w?.exposure_balance || 0), status:String(r.status || "ACTIVE"), wallet_status:String(w?.status || "NO_WALLET") };
      }));
    } else {
      const { data: customerRows, error: customerError } = await supabase
        .from("customers")
        .select("id, profile_id, source, status, customer_code, agent_id, created_at")
        .neq("status", "DELETED")
        .order("created_at", { ascending: false });
      if (customerError) throw customerError;
      const rows = customerRows || [];
      const cids = rows.map((r) => r.profile_id).filter(Boolean);
      const aids = [...new Set(rows.map((r) => r.agent_id).filter(Boolean))];
      const [cpr, ar, wr] = await Promise.all([
        cids.length ? supabase.from("profiles").select("id, username, status").in("id", cids) : Promise.resolve({data:[],error:null}),
        aids.length ? supabase.from("agents").select("id, profile_id, agent_code, status").in("id", aids) : Promise.resolve({data:[],error:null}),
        cids.length ? supabase.from("wallets").select("owner_profile_id, available_balance, exposure_balance, status, currency").in("owner_profile_id", cids) : Promise.resolve({data:[],error:null}),
      ]);
      if (cpr.error) throw cpr.error; if (ar.error) throw ar.error; if (wr.error) throw wr.error;
      const cpm = new Map((cpr.data || []).map((p) => [String(p.id), p]));
      const am = new Map((ar.data || []).map((a) => [String(a.id), a]));
      const apids = [...new Set((ar.data || []).map((a) => a.profile_id).filter(Boolean))];
      const apr = apids.length ? await supabase.from("profiles").select("id, username").in("id", apids) : {data:[],error:null};
      if (apr.error) throw apr.error;
      const apm = new Map((apr.data || []).map((p) => [String(p.id), p]));
      const wm = new Map((wr.data || []).filter((w) => w.currency === "USD").map((w) => [String(w.owner_profile_id), w]));
      setSuperAdminCustomerAccounts(rows.filter((r) => cpm.get(String(r.profile_id))?.status !== "DELETED").map((r) => {
        const p = cpm.get(String(r.profile_id)); const a = r.agent_id ? am.get(String(r.agent_id)) : null;
        const ap = a?.profile_id ? apm.get(String(a.profile_id)) : null; const w = wm.get(String(r.profile_id));
        return { id:String(r.id), profile_id:String(r.profile_id), username:String(p?.username || r.customer_code || ""),
          customer_code:String(r.customer_code || ""), source:String(r.source || "UNKNOWN"), agent_id:r.agent_id ? String(r.agent_id) : null,
          agent_username:String(ap?.username || a?.agent_code || "ONLINE"), available_balance:Number(w?.available_balance || 0),
          exposure_balance:Number(w?.exposure_balance || 0), status:String(r.status || "ACTIVE"), wallet_status:String(w?.status || "NO_WALLET") };
      }));
    }
    setSuperAdminAccountPage(1);
  } catch (error: any) {
    setAdminError(error?.message || String(error));
  } finally { setAdminLoading(false); }
};

const setAgentAccountStatus = async (account: { profile_id: string; username: string; status: string }) => {
  const nextStatus = account.status === "PAUSED" ? "ACTIVE" : "PAUSED";
  if (!window.confirm(`${nextStatus === "PAUSED" ? "PAUSE" : "RESUME"} Agent Admin "${account.username}"?`)) return;
  setAdminLoading(true); setAdminError(""); setAdminSuccess("");
  try {
    const { data, error } = await supabase.rpc("set_agent_account_status", { p_agent_profile_id: account.profile_id, p_status: nextStatus });
    if (error) throw error; if (!data?.success) throw new Error("Agent status update did not complete.");
    setAdminSuccess(`Agent Admin ${account.username} is now ${nextStatus}.`);
    await loadSuperAdminAccountDirectory("AGENT"); await loadSuperAdminDashboard();
  } catch (error: any) { setAdminError(error?.message || String(error)); }
  finally { setAdminLoading(false); }
};

const deleteAgentAccount = async (account: { profile_id: string; username: string; available_balance: number; exposure_balance: number }) => {
  const available = Number(account.available_balance || 0);
  const exposure = Number(account.exposure_balance || 0);
  if (available !== 0 || exposure !== 0) {
    setAdminError(`Agent Admin "${account.username}" cannot be deleted until Available and Exposure are both $0.00.`);
    return;
  }
  if (!window.confirm(`DELETE Agent Admin "${account.username}"? The account will be deactivated while its wallet, customers, bets and history are retained.`)) return;
  setAdminLoading(true); setAdminError(""); setAdminSuccess("");
  try {
    const { data, error } = await supabase.rpc("delete_agent_account", { p_agent_profile_id: account.profile_id });
    if (error) throw error;
    if (!data?.success) throw new Error("Agent deletion did not complete.");
    setSelectedAdminAccount(null);
    setAdminSuccess(`Agent Admin ${account.username} was deleted.`);
    await loadSuperAdminAccountDirectory("AGENT");
    await loadSuperAdminDashboard();
  } catch (error: any) {
    setAdminError(error?.message || String(error));
  } finally {
    setAdminLoading(false);
  }
};

const setSuperAdminCustomerAccountStatus = async (account: { profile_id: string; username: string; status: string }) => {
  const nextStatus = account.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
  if (!window.confirm(`${nextStatus === "BLOCKED" ? "PAUSE" : "RESUME"} Customer "${account.username}"?`)) return;
  setAdminLoading(true); setAdminError(""); setAdminSuccess("");
  try {
    const { data, error } = await supabase.rpc("set_customer_account_status", { p_customer_profile_id: account.profile_id, p_status: nextStatus });
    if (error) throw error; if (!data?.success) throw new Error("Customer status update did not complete.");
    setAdminSuccess(`Customer ${account.username} is now ${nextStatus === "BLOCKED" ? "PAUSED" : "ACTIVE"}.`);
    await loadSuperAdminAccountDirectory("CUSTOMER"); await loadSuperAdminDashboard();
  } catch (error: any) { setAdminError(error?.message || String(error)); }
  finally { setAdminLoading(false); }
};

const deleteCustomerAccount = async (account: { profile_id: string; username: string; available_balance: number; exposure_balance: number }) => {
  const available = Number(account.available_balance || 0);
  const exposure = Number(account.exposure_balance || 0);
  if (available !== 0 || exposure !== 0) {
    setAdminError(`Customer "${account.username}" cannot be deleted until Available and Exposure are both $0.00.`);
    return;
  }
  if (!window.confirm(`DELETE Customer "${account.username}"? The account will be deactivated while its wallet, bets and history are retained.`)) return;
  setAdminLoading(true); setAdminError(""); setAdminSuccess("");
  try {
    const { data, error } = await supabase.rpc("delete_customer_account", { p_customer_profile_id: account.profile_id });
    if (error) throw error;
    if (!data?.success) throw new Error("Customer deletion did not complete.");
    setSelectedAdminAccount(null);
    setAdminSuccess(`Customer ${account.username} was deleted.`);
    await loadSuperAdminAccountDirectory("CUSTOMER");
    await loadSuperAdminDashboard();
  } catch (error: any) {
    setAdminError(error?.message || String(error));
  } finally {
    setAdminLoading(false);
  }
};

const loadAgentAllCustomerAccounts = async (page = agentAllCustomerPage, search = agentAllCustomerSearch) => {
  setAgentAllCustomerLoading(true);
  setAgentCustomerError("");
  try {
    const accessToken = await getFreshAgentAdminAccessToken();
    const safePage = Math.max(1, Math.floor(page));
    const safeSearch = String(search || "").trim().toLowerCase();
    const { data, error } = await supabase.functions.invoke("agent-customer-admin", {
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { action: "list", page: safePage, page_size: 25, search: safeSearch },
    });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error || "Unable to load customer accounts.");
    setAgentCustomerSearchTotal(Number(data.total || 0));
    setAgentAllCustomers((data.customers || []).map((c: any) => ({
      id: String(c.id), profile_id: String(c.profile_id || c.id), username: String(c.username || c.customer_code || ""),
      customer_code: String(c.customer_code || ""), full_name: String(c.full_name || ""), email: String(c.email || ""),
      available_balance: Number(c.available_balance || 0), exposure_balance: Number(c.exposure_balance || 0),
      status: String(c.status || "ACTIVE"), wallet_status: String(c.wallet_status || "ACTIVE"),
    })));
    setAgentAllCustomerPage(safePage);
  } catch (error: any) {
    setAgentCustomerError(error?.message || String(error));
  } finally {
    setAgentAllCustomerLoading(false);
  }
};

const loadAgentBetHistory = async (page = 0) => {
  if (agentReportsLoading) return;
  setAgentReportsLoading(true);
  setAgentCustomerError("");
  try {
    const pageSize = 25;
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const { data: itemRows, error: itemError, count } = await supabase
      .from("bet_items")
      .select("id, bet_id, customer_id, session_id, bet_type, played_number, stake, rate, potential_win, status, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (itemError) throw itemError;
    const rows = itemRows || [];
    setAgentReportsTotal(Number(count || 0));
    if (rows.length === 0) {
      setAgentReportsRows([]);
      setAgentReportsPage(page);
      return;
    }

    const betIds = [...new Set(rows.map((row: any) => row.bet_id).filter(Boolean))];
    const customerIds = [...new Set(rows.map((row: any) => row.customer_id).filter(Boolean))];
    const sessionIds = [...new Set(rows.map((row: any) => row.session_id).filter(Boolean))];
    const [betResult, customerResult, sessionResult, resultResult] = await Promise.all([
      betIds.length ? supabase.from("bets").select("id, customer_id, agent_id, session_id").in("id", betIds) : Promise.resolve({ data: [], error: null }),
      customerIds.length ? supabase.from("customers").select("id, profile_id, agent_id").in("id", customerIds) : Promise.resolve({ data: [], error: null }),
      sessionIds.length ? supabase.from("game_sessions").select("id, session_code, game_id, session_date, bazi_no, market").in("id", sessionIds) : Promise.resolve({ data: [], error: null }),
      sessionIds.length ? supabase.from("results").select("session_id, single_digit, patti, status, is_current").in("session_id", sessionIds).eq("is_current", true).eq("status", "DECLARED") : Promise.resolve({ data: [], error: null }),
    ]);
    if (betResult.error) throw betResult.error;
    if (customerResult.error) throw customerResult.error;
    if (sessionResult.error) throw sessionResult.error;
    if (resultResult.error) throw resultResult.error;

    const customers = customerResult.data || [];
    const sessions = sessionResult.data || [];
    const results = resultResult.data || [];
    const profileIds = customers.map((row: any) => row.profile_id).filter(Boolean);
    const gameIds = [...new Set(sessions.map((row: any) => row.game_id).filter(Boolean))];
    const [profileResult, gameResult] = await Promise.all([
      profileIds.length ? supabase.from("profiles").select("id, username").in("id", profileIds) : Promise.resolve({ data: [], error: null }),
      gameIds.length ? supabase.from("games").select("id, game_name").in("id", gameIds) : Promise.resolve({ data: [], error: null }),
    ]);
    if (profileResult.error) throw profileResult.error;
    if (gameResult.error) throw gameResult.error;

    const profileMap = new Map((profileResult.data || []).map((row: any) => [String(row.id), String(row.username || "")]));
    const customerMap = new Map(customers.map((row: any) => [String(row.id), row]));
    const sessionMap = new Map(sessions.map((row: any) => [String(row.id), row]));
    const resultMap = new Map(results.map((row: any) => [String(row.session_id), row]));
    const gameMap = new Map((gameResult.data || []).map((row: any) => [String(row.id), String(row.game_name || "Game")]));

    setAgentReportsRows(rows.map((row: any) => {
      const customer = customerMap.get(String(row.customer_id));
      const session = sessionMap.get(String(row.session_id));
      const result = session ? resultMap.get(String(session.id)) : null;
      return {
        id: String(row.id),
        bet_time: String(row.created_at || ""),
        username: profileMap.get(String(customer?.profile_id || "")) || "-",
        game_name: gameMap.get(String(session?.game_id || "")) || "Game",
        session_code: String(session?.session_code || "-"),
        bazi_no: session?.bazi_no == null ? null : Number(session.bazi_no),
        market: String(session?.market || "-"),
        bet_type: String(row.bet_type || "-"),
        played_number: String(row.played_number ?? "-"),
        stake: Number(row.stake || 0),
        rate: Number(row.rate || 0),
        potential_win: Number(row.potential_win || 0),
        result: result ? `${String(result.single_digit || "-")} - ${String(result.patti || "-")}` : "-",
        status: String(row.status || "-"),
      };
    }));
    setAgentReportsPage(page);
  } catch (error: any) {
    setAgentReportsRows([]);
    setAgentReportsTotal(0);
    setAgentCustomerError(error?.message || String(error));
  } finally {
    setAgentReportsLoading(false);
  }
};

const resetAgentCustomerPassword = async () => {
  setAgentCustomerError("");
  setAgentCustomerSuccess("");

  const targetProfileId = String(adminPasswordResetTarget || "").trim();
  const newPassword = String(adminPasswordResetPassword || "");

  if (!targetProfileId) {
    setAgentCustomerError("Please select a Customer.");
    return;
  }

  if (newPassword.length < 8 || newPassword.length > 16) {
    setAgentCustomerError("Password must be 8 to 16 characters.");
    return;
  }

  const targetCustomer = agentAllCustomers.find(
    (customer) => String(customer.profile_id) === targetProfileId
  );

  if (!targetCustomer) {
    setAgentCustomerError("Selected Customer was not found in your Customer Accounts.");
    return;
  }

  setAgentAllCustomerLoading(true);

  try {
    const accessToken = await getFreshAgentAdminAccessToken();

    const { data, error } = await supabase.functions.invoke("agent-customer-admin", {
      headers: { Authorization: "Bearer " + accessToken },
      body: {
        action: "reset_customer_password",
        profile_id: targetProfileId,
        password: newPassword,
      },
    });

    if (error) throw error;
    if (!data?.success) {
      throw new Error(data?.error || "Unable to reset customer password.");
    }

    setAgentCustomerSuccess(
      "Customer " + String(targetCustomer.username || "") + " password reset successfully."
    );
    setAdminPasswordResetPassword("");
  } catch (error: any) {
    setAgentCustomerError(error?.message || String(error));
  } finally {
    setAgentAllCustomerLoading(false);
  }
};

const setAgentCustomerAccountStatus = async (account: { profile_id: string; username: string; status: string }) => {
  const nextStatus = account.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
  if (!window.confirm(`${nextStatus === "BLOCKED" ? "PAUSE" : "RESUME"} Customer "${account.username}"?`)) return;
  setAgentAllCustomerLoading(true); setAgentCustomerError(""); setAgentCustomerSuccess("");
  try {
    const { data, error } = await supabase.rpc("set_customer_account_status", { p_customer_profile_id: account.profile_id, p_status: nextStatus });
    if (error) throw error; if (!data?.success) throw new Error("Customer status update did not complete.");
    setAgentCustomerSuccess(`Customer ${account.username} is now ${nextStatus === "BLOCKED" ? "PAUSED" : "ACTIVE"}.`);
    await loadAgentAllCustomerAccounts(); await loadAgentCustomerPage(1);
  } catch (error: any) { setAgentCustomerError(error?.message || String(error)); }
  finally { setAgentAllCustomerLoading(false); }
};

const renderSuperAdminAccountDirectory = () => {
  const source = superAdminAccountView === "AGENT" ? superAdminAgentAccounts : superAdminCustomerAccounts;
  const query = superAdminAccountSearch.trim().toLowerCase();
  const filtered = source.filter((a:any) => !query || String(a.username || "").toLowerCase().includes(query));
  const pageSize=10, pageCount=Math.max(1,Math.ceil(filtered.length/pageSize)), page=Math.min(superAdminAccountPage,pageCount);
  const rows=filtered.slice((page-1)*pageSize,page*pageSize);
  return (
    <section className="admin-panel-card">
      <div className="admin-panel-title-row"><div className="admin-panel-title">CUSTOMER & ADMIN ALL ACCOUNTS</div><button type="button" className="admin-small-action" onClick={()=>setAdminModule("HOME")}>BACK</button></div>
      <div className="admin-module-grid">
        <button type="button" className={`admin-module-card ${superAdminAccountView==="CUSTOMER"?"active":""}`} onClick={()=>{setSuperAdminAccountView("CUSTOMER");setSuperAdminAccountSearch("");setSuperAdminAccountPage(1);setSelectedAdminAccount(null);void loadSuperAdminAccountDirectory("CUSTOMER");}}><b>Customer — All Accounts</b><small>Agent-created + online customers</small></button>
        <button type="button" className={`admin-module-card ${superAdminAccountView==="AGENT"?"active":""}`} onClick={()=>{setSuperAdminAccountView("AGENT");setSuperAdminAccountSearch("");setSuperAdminAccountPage(1);setSelectedAdminAccount(null);void loadSuperAdminAccountDirectory("AGENT");}}><b>Agent Admin — All Accounts</b><small>All Agent Admin accounts</small></button>
      </div>
      {superAdminAccountView ? <>
        <div className="admin-wallet-lookup-row" style={{marginBottom:"8px"}}><input className="admin-form-input" type="text" value={superAdminAccountSearch} onChange={e=>{setSuperAdminAccountSearch(e.target.value);setSuperAdminAccountPage(1);}} placeholder="Search username..." maxLength={50}/><button type="button" className="admin-small-action" onClick={()=>setSuperAdminAccountPage(1)}>SEARCH</button></div>
        {selectedAdminAccount ? <div className="admin-wallet-result-row" style={{marginBottom:"8px"}}><div><b>{selectedAdminAccount.username}</b><small>{superAdminAccountView==="CUSTOMER"?`${selectedAdminAccount.source} • ${selectedAdminAccount.customer_code} • ${selectedAdminAccount.agent_username}`:selectedAdminAccount.agent_code}</small></div><div className="admin-wallet-result-balances"><span>Available <strong className="admin-available-value">${Number(selectedAdminAccount.available_balance||0).toFixed(2)}</strong></span><span>Exposure <strong className="admin-exposure-value">${Number(selectedAdminAccount.exposure_balance||0).toFixed(2)}</strong></span><span>Status <strong>{selectedAdminAccount.status==="BLOCKED"?"PAUSED":selectedAdminAccount.status}</strong></span><span>Wallet <strong>{selectedAdminAccount.wallet_status}</strong></span></div></div>:null}
        {adminLoading?<div className="admin-empty">LOADING ACCOUNTS...</div>:rows.length===0?<div className="admin-empty">No accounts found.</div>:<div className="admin-agent-list">{rows.map((a:any)=><div className="admin-agent-row" key={a.id} style={{alignItems:"flex-start",flexWrap:"wrap"}}><div style={{flex:1,minWidth:"150px"}}><b>{a.username}</b><small>{superAdminAccountView==="CUSTOMER"?`${a.agent_username} • ${a.source}`:a.agent_code}</small><small>Available $ {Number(a.available_balance||0).toFixed(2)} • Exposure $ {Number(a.exposure_balance||0).toFixed(2)}</small></div><div style={{display:"flex",gap:"5px",flexWrap:"wrap",justifyContent:"flex-end"}}><span className={`admin-status ${a.status==="ACTIVE"?"active":""}`}>{a.status==="BLOCKED"?"PAUSED":a.status}</span><button type="button" className="admin-small-action" onClick={()=>setSelectedAdminAccount(a)}>VIEW</button><button type="button" className="admin-small-action" onClick={()=>superAdminAccountView==="AGENT"?void setAgentAccountStatus(a):void setSuperAdminCustomerAccountStatus(a)} disabled={adminLoading}>{superAdminAccountView==="AGENT"?(a.status==="PAUSED"?"RESUME AGENT":"PAUSE AGENT"):(a.status==="BLOCKED"?"RESUME CUSTOMER":"PAUSE CUSTOMER")}</button><button type="button" className="admin-small-action" onClick={()=>superAdminAccountView==="AGENT"?void deleteAgentAccount(a):void deleteCustomerAccount(a)} disabled={adminLoading || Number(a.available_balance||0)!==0 || Number(a.exposure_balance||0)!==0} title={(Number(a.available_balance||0)!==0 || Number(a.exposure_balance||0)!==0)?"Delete requires Available = $0.00 and Exposure = $0.00":"DELETE account"}>DELETE</button></div></div>)}</div>}
        {pageCount>1?<div className="admin-pagination"><button type="button" className="admin-small-action" disabled={page<=1} onClick={()=>setSuperAdminAccountPage(page-1)}>PREVIOUS</button><span>PAGE {page} / {pageCount}</span><button type="button" className="admin-small-action" disabled={page>=pageCount} onClick={()=>setSuperAdminAccountPage(page+1)}>NEXT</button></div>:null}
      </>:<div className="admin-empty">Select Customer — All Accounts or Agent Admin — All Accounts.</div>}
    </section>
  );
};


const loadContactSettings = async () => {
  try {
    const { data, error } = await supabase
      .from("site_contact_settings")
      .select("whatsapp_link, telegram_link")
      .eq("singleton_key", true)
      .maybeSingle();

    if (error) throw error;

    setContactWhatsappLink(String(data?.whatsapp_link || "").trim());
    setContactTelegramLink(String(data?.telegram_link || "").trim());
  } catch (error: any) {
    console.error("=== CONTACT SETTINGS LOAD ERROR ===", error);
    setContactWhatsappLink("");
    setContactTelegramLink("");
  }
};

const saveContactSettings = async () => {
  setAdminError("");
  setAdminSuccess("");

  const whatsappLink = contactWhatsappLink.trim();
  const telegramLink = contactTelegramLink.trim();

  const validateContactLink = (value: string, label: string) => {
    if (!value) return;
    try {
      const url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error(`${label} must use HTTP or HTTPS.`);
      }
    } catch {
      throw new Error(`${label} must be a valid HTTP or HTTPS URL.`);
    }
  };

  try {
    validateContactLink(whatsappLink, "WhatsApp Link");
    validateContactLink(telegramLink, "Telegram Link");
  } catch (error: any) {
    setAdminError(error?.message || String(error));
    return;
  }

  setContactLoading(true);
  setAdminLoading(true);

  try {
    const { data: existing, error: existingError } = await supabase
      .from("site_contact_settings")
      .select("id")
      .eq("singleton_key", true)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing?.id) {
      const { error } = await supabase
        .from("site_contact_settings")
        .update({
          whatsapp_link: whatsappLink || null,
          telegram_link: telegramLink || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("site_contact_settings")
        .insert({
          singleton_key: true,
          whatsapp_link: whatsappLink || null,
          telegram_link: telegramLink || null,
        });

      if (error) throw error;
    }

    setContactWhatsappLink(whatsappLink);
    setContactTelegramLink(telegramLink);
    setAdminSuccess("Contact links saved successfully.");
  } catch (error: any) {
    console.error("=== CONTACT SETTINGS SAVE ERROR ===", error);
    setAdminError(error?.message || String(error));
  } finally {
    setContactLoading(false);
    setAdminLoading(false);
  }
};

const loadSuperAdminDashboard = async () => {
setAdminLoading(true);
setAdminError("");
try {
const [agentsResult, customersResult, walletsResult, profilesResult, customerProfilesResult, supplyResult, saBalanceResult, supplyChangeResult, mainSupplyResult] = await Promise.all([
  supabase.from("agents").select("id, agent_code, profile_id, status", { count: "exact" }).neq("status", "DELETED").order("created_at", { ascending: false }).limit(20),
  supabase.from("customers").select("id, profile_id, source, status, customer_code, agent_id", { count: "exact" }),
  supabase.from("wallets").select("owner_profile_id, available_balance, exposure_balance, status, currency"),
  supabase.from("profiles").select("id, username").eq("role", "AGENT_ADMIN"),
  supabase.from("profiles").select("id, username").eq("role", "CUSTOMER"),
  supabase.rpc("get_super_admin_virtual_usd_supply"),
  supabase.rpc("get_super_admin_virtual_usd_balance"),
  supabase.rpc("get_super_admin_supply_change"),
  supabase.rpc("get_super_admin_main_supply"),
]);
if (agentsResult.error) throw agentsResult.error;
if (customersResult.error) throw customersResult.error;
if (walletsResult.error) throw walletsResult.error;
if (profilesResult.error) throw profilesResult.error;
if (customerProfilesResult.error) throw customerProfilesResult.error;
if (supplyResult.error) throw supplyResult.error;
if (saBalanceResult.error) throw saBalanceResult.error;
if (supplyChangeResult.error) throw supplyChangeResult.error;
    if (mainSupplyResult.error) throw mainSupplyResult.error;
const customers = customersResult.data || [];
const wallets = walletsResult.data || [];
const profileUsernames = new Map(
  (profilesResult.data || []).map((profile) => [profile.id, profile.username || ""])
);
const customerProfileUsernames = new Map(
  (customerProfilesResult.data || []).map((profile) => [profile.id, profile.username || ""])
);
const agentProfileIds = new Set(
  (agentsResult.data || []).map((agent) => agent.profile_id)
);
const customerProfileIds = new Set(
  customers.filter((item) => item.status === "ACTIVE").map((item) => item.profile_id)
);
const activeUsdWallets = wallets.filter(
  (item) => item.status === "ACTIVE" && item.currency === "USD"
);
const agentAvailable = activeUsdWallets
  .filter((wallet) => agentProfileIds.has(wallet.owner_profile_id))
  .reduce((sum, wallet) => sum + Number(wallet.available_balance || 0), 0);
const agentExposure = activeUsdWallets
  .filter((wallet) => agentProfileIds.has(wallet.owner_profile_id))
  .reduce((sum, wallet) => sum + Number(wallet.exposure_balance || 0), 0);
const customerAvailable = activeUsdWallets
  .filter((wallet) => customerProfileIds.has(wallet.owner_profile_id))
  .reduce((sum, wallet) => sum + Number(wallet.available_balance || 0), 0);
const customerExposure = activeUsdWallets
  .filter((wallet) => customerProfileIds.has(wallet.owner_profile_id))
  .reduce((sum, wallet) => sum + Number(wallet.exposure_balance || 0), 0);
const onlineCustomerRows = customers
  .filter((customer) => customer.source === "ONLINE" && customer.agent_id == null && customer.status === "ACTIVE")
  .map((customer) => {
    const wallet = activeUsdWallets.find(
      (item) => item.owner_profile_id === customer.profile_id
    );
    return {
      id: customer.id,
      profile_id: customer.profile_id,
      customer_code: customer.customer_code || "CUSTOMER",
      username: customerProfileUsernames.get(customer.profile_id) || "",
      status: customer.status,
      available_balance: Number(wallet?.available_balance || 0),
    };
  });
const networkAvailable = agentAvailable + customerAvailable;
const networkExposure = agentExposure + customerExposure;
const supply = Array.isArray(supplyResult.data) ? supplyResult.data[0] : supplyResult.data;
const saBalance = Array.isArray(saBalanceResult.data) ? saBalanceResult.data[0] : saBalanceResult.data;
const supplyChange = Array.isArray(supplyChangeResult.data) ? supplyChangeResult.data[0] : supplyChangeResult.data;
const mainSupply = Array.isArray(mainSupplyResult.data) ? mainSupplyResult.data[0] : mainSupplyResult.data;
const totalSpendable =
  Number(saBalance?.operating_available || 0) + Number(saBalance?.plus_available || 0);
const superAdminAvailable = Number(mainSupply?.super_admin_available || 0);
setAdminAgents((agentsResult.data || []).map((agent) => {
  const wallet = activeUsdWallets.find(
    (item) => item.owner_profile_id === agent.profile_id
  );

  return {
    id: agent.id,
    agent_code: agent.agent_code,
    profile_id: agent.profile_id,
    status: agent.status,
    username: profileUsernames.get(agent.profile_id) || "",
    available_balance: Number(wallet?.available_balance || 0),
    exposure_balance: Number(wallet?.exposure_balance || 0),
    wallet_status: wallet?.status || "NO_WALLET",
  };
}));
setOnlineCustomers(onlineCustomerRows);

setAdminStats({
  agents: agentsResult.count || 0,
  customers: customers.filter((item) => item.status === "ACTIVE").length,
  onlineCustomers: customers.filter((item) => item.source === "ONLINE" && item.status === "ACTIVE").length,
  available: superAdminAvailable,
  exposure: networkExposure,
});
setAdminAccountStats({
  totalSupply: Number(supply?.available_supply || 0),
  superAdminAvailable,
  totalSpendable,
  distributed: networkAvailable + networkExposure,
  agentAvailable,
  agentExposure,
  customerAvailable,
  customerExposure,
  networkAvailable,
  networkExposure,
  supplyChange: Number(supplyChange?.supply_change || 0),
});
} catch (error: any) {
console.error("=== SUPER ADMIN DASHBOARD LOAD ERROR ===", error);
setAdminError(
  `DASHBOARD LOAD ERROR — ${error?.message || String(error)}`
);
} finally {
setAdminLoading(false);
}
};

const transferSuperAdminOnlineCustomer = async (direction: "SUPER_ADMIN_TO_CUSTOMER" | "CUSTOMER_TO_SUPER_ADMIN") => {
  setAdminError("");
  setAdminSuccess("");

  if (!onlineCoinCustomerId) {
    setAdminError("Please select an Online Customer.");
    return;
  }

  const amount = Number(onlineCoinAmount);
  if (!Number.isFinite(amount) || amount <= 0) {
    setAdminError("Please enter a valid amount greater than 0.");
    return;
  }

  if (Math.round(amount * 100) !== amount * 100) {
    setAdminError("Amount can have a maximum of 2 decimal places.");
    return;
  }

  setAdminLoading(true);

  try {
    const { data, error } = await supabase.rpc(
      "transfer_virtual_usd_super_admin_online_customer",
      {
        p_customer_id: onlineCoinCustomerId,
        p_amount: amount,
        p_direction: direction,
      }
    );

    if (error) throw error;

    const result = Array.isArray(data) ? data[0] : data;
    if (!result) {
      throw new Error("Transfer completed but no result was returned.");
    }

    const currentMainSupply = await getCurrentSuperAdminMainSupply();

    setOnlineCoinAmount("");
    const successMessage =
      direction === "SUPER_ADMIN_TO_CUSTOMER"
        ? `Virtual USD deposited successfully. $${amount.toFixed(2)} sent to the Online Customer. Super Admin Available Supply: $${currentMainSupply.toFixed(2)}.`
        : `Virtual USD withdrawn successfully. $${amount.toFixed(2)} returned from the Online Customer. Super Admin Available Supply: $${currentMainSupply.toFixed(2)}.`;

    await loadSuperAdminDashboard();
    setAdminSuccess(successMessage);
  } catch (error: any) {
    console.error("=== SUPER ADMIN ONLINE CUSTOMER TRANSFER ERROR ===", error);
    setAdminSuccess("");
    setAdminError(error?.message || String(error));
  } finally {
    setAdminLoading(false);
  }
};

const loadAuditTransactions = async (page = 0) => {
  if (auditLoading) return;
  setAuditLoading(true);
  setAdminError("");
  try {
    const pageSize = 25;
    const { data, error } = await supabase.rpc("get_super_admin_audit_transaction_rows", {
      p_limit: pageSize + 1,
      p_offset: Math.max(0, page) * pageSize,
    });
    if (error) throw error;
    const rows = Array.isArray(data) ? data : [];
    setAuditTransactionHasNext(rows.length > pageSize);
    setAuditTransactionRows(rows.slice(0, pageSize).map((row: any) => ({
      transaction_id: row.transaction_id,
      transaction_code: row.transaction_code,
      created_at: row.created_at,
      username: row.username ?? null,
      counterparty_type: row.counterparty_type ?? null,
      direction: row.direction || "-",
      amount: Number(row.amount || 0),
      super_admin_available_after: Number(row.super_admin_available_after || 0),
    })));
    setAuditTransactionPage(Math.max(0, page));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load Transaction Audit.";
    setAuditTransactionRows([]);
    setAuditTransactionHasNext(false);
    setAdminError(message || "Unable to load Transaction Audit.");
  } finally {
    setAuditLoading(false);
  }
};

const loadAuditSettlements = async (page = 0) => {
  if (auditLoading) return;
  setAuditLoading(true);
  setAdminError("");
  try {
    const pageSize = 25;
    const { data, error } = await supabase.rpc("get_super_admin_audit_settlement_rows", {
      p_limit: pageSize + 1,
      p_offset: Math.max(0, page) * pageSize,
    });
    if (error) throw error;
    const rows = Array.isArray(data) ? data : [];
    setAuditSettlementHasNext(rows.length > pageSize);
    setAuditSettlementRows(rows.slice(0, pageSize).map((row: any) => ({
      settlement_id: row.settlement_id,
      settlement_code: row.settlement_code,
      settled_at: row.settled_at,
      game_name: row.game_name || "-",
      bazi_label: row.bazi_label || "-",
      result_text: row.result_text || "-",
      settlement_amount: Number(row.settlement_amount || 0),
      network_change: Number(row.network_change || 0),
      network_unburned_available_after: Number(row.network_unburned_available_after || 0),
    })));
    setAuditSettlementPage(Math.max(0, page));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load Settlement Audit.";
    setAuditSettlementRows([]);
    setAuditSettlementHasNext(false);
    setAdminError(message || "Unable to load Settlement Audit.");
  } finally {
    setAuditLoading(false);
  }
};

const loadSuperAdminReports = async (page = 0) => {
  if (reportsLoading) return;
  setReportsLoading(true);
  setAdminError("");
  try {
    const pageSize = 25;
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const { data: itemRows, error: itemError, count } = await supabase
      .from("bet_items")
      .select("id, bet_id, customer_id, session_id, bet_type, played_number, stake, rate, potential_win, status, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (itemError) throw itemError;
    const rows = itemRows || [];
    setReportsTotal(Number(count || 0));
    if (rows.length === 0) {
      setReportsRows([]);
      setReportsPage(page);
      return;
    }

    const betIds = [...new Set(rows.map((row: any) => row.bet_id).filter(Boolean))];
    const customerIds = [...new Set(rows.map((row: any) => row.customer_id).filter(Boolean))];
    const sessionIds = [...new Set(rows.map((row: any) => row.session_id).filter(Boolean))];

    const [betResult, customerResult, sessionResult, resultResult] = await Promise.all([
      betIds.length ? supabase.from("bets").select("id, customer_id, agent_id, session_id").in("id", betIds) : Promise.resolve({ data: [], error: null }),
      customerIds.length ? supabase.from("customers").select("id, profile_id, source, agent_id").in("id", customerIds) : Promise.resolve({ data: [], error: null }),
      sessionIds.length ? supabase.from("game_sessions").select("id, session_code, game_id, session_date, bazi_no, market").in("id", sessionIds) : Promise.resolve({ data: [], error: null }),
      sessionIds.length ? supabase.from("results").select("session_id, single_digit, patti, status, is_current").in("session_id", sessionIds).eq("is_current", true).eq("status", "DECLARED") : Promise.resolve({ data: [], error: null }),
    ]);
    if (betResult.error) throw betResult.error;
    if (customerResult.error) throw customerResult.error;
    if (sessionResult.error) throw sessionResult.error;
    if (resultResult.error) throw resultResult.error;

    const bets = betResult.data || [];
    const customers = customerResult.data || [];
    const sessions = sessionResult.data || [];
    const results = resultResult.data || [];
    const profileIds = customers.map((row: any) => row.profile_id).filter(Boolean);
    const agentIds = [...new Set(customers.map((row: any) => row.agent_id).filter(Boolean))];
    const gameIds = [...new Set(sessions.map((row: any) => row.game_id).filter(Boolean))];

    const [profileResult, agentResult, gameResult] = await Promise.all([
      profileIds.length ? supabase.from("profiles").select("id, username").in("id", profileIds) : Promise.resolve({ data: [], error: null }),
      agentIds.length ? supabase.from("agents").select("id, profile_id, agent_code").in("id", agentIds) : Promise.resolve({ data: [], error: null }),
      gameIds.length ? supabase.from("games").select("id, game_name").in("id", gameIds) : Promise.resolve({ data: [], error: null }),
    ]);
    if (profileResult.error) throw profileResult.error;
    if (agentResult.error) throw agentResult.error;
    if (gameResult.error) throw gameResult.error;

    const profileMap = new Map((profileResult.data || []).map((row: any) => [String(row.id), String(row.username || "")]));
    const agentMap = new Map((agentResult.data || []).map((row: any) => [String(row.id), row]));
    const agentProfileIds = (agentResult.data || []).map((row: any) => row.profile_id).filter(Boolean);
    const agentProfileResult = agentProfileIds.length
      ? await supabase.from("profiles").select("id, username").in("id", agentProfileIds)
      : { data: [], error: null };
    if (agentProfileResult.error) throw agentProfileResult.error;

    const agentProfileMap = new Map((agentProfileResult.data || []).map((row: any) => [String(row.id), String(row.username || "")]));
    const gameMap = new Map((gameResult.data || []).map((row: any) => [String(row.id), String(row.game_name || "Game")]));
    const customerMap = new Map(customers.map((row: any) => [String(row.id), row]));
    const betMap = new Map(bets.map((row: any) => [String(row.id), row]));
    const sessionMap = new Map(sessions.map((row: any) => [String(row.id), row]));
    const resultMap = new Map(results.map((row: any) => [String(row.session_id), row]));

    setReportsRows(rows.map((row: any) => {
      const customer = customerMap.get(String(row.customer_id));
      const bet = betMap.get(String(row.bet_id));
      const session = sessionMap.get(String(row.session_id || bet?.session_id));
      const agent = customer?.agent_id ? agentMap.get(String(customer.agent_id)) : null;
      const result = session ? resultMap.get(String(session.id)) : null;
      return {
        id: String(row.id),
        bet_time: String(row.created_at || ""),
        username: profileMap.get(String(customer?.profile_id || "")) || "-",
        customer_source: String(customer?.source || "").toUpperCase() === "ONLINE" ? "Online Customer" : "Agent Customer",
        agent_username: agent ? (agentProfileMap.get(String(agent.profile_id)) || String(agent.agent_code || "-")) : "-",
        game_name: gameMap.get(String(session?.game_id || "")) || "Game",
        session_code: String(session?.session_code || "-"),
        bazi_no: session?.bazi_no == null ? null : Number(session.bazi_no),
        market: String(session?.market || "-"),
        bet_type: String(row.bet_type || "-"),
        played_number: String(row.played_number ?? "-"),
        stake: Number(row.stake || 0),
        rate: Number(row.rate || 0),
        potential_win: Number(row.potential_win || 0),
        result: result ? `${String(result.single_digit || "-")} - ${String(result.patti || "-")}` : "-",
        status: String(row.status || "-"),
      };
    }));
    setReportsPage(page);
  } catch (error: any) {
    setReportsRows([]);
    setReportsTotal(0);
    setAdminError(error?.message || String(error));
  } finally {
    setReportsLoading(false);
  }
};

const loadSettlementModule = async () => {
  setSettlementLoading(true);
  setAdminError("");
  setAdminSuccess("");
  try {
    const { data: sessions, error: sessionsError } = await supabase
      .from("game_sessions")
      .select("id, session_code, game_id, session_date, bazi_no, market, status")
      .eq("status", "RESULT_DECLARED")
      .eq("scheduled_playable", true)
      .order("session_date", { ascending: false })
      .order("bazi_no", { ascending: true, nullsFirst: true })
      .order("market", { ascending: true });
    if (sessionsError) throw sessionsError;
    const sessionRows = sessions || [];
    if (sessionRows.length === 0) { setSettlementSessions([]); return; }
    const sessionIds = sessionRows.map((row) => row.id);
    const gameIds = [...new Set(sessionRows.map((row) => row.game_id))];
    const [gamesResult, resultsResult, betItemsResult] = await Promise.all([
      supabase.from("games").select("id, game_name").in("id", gameIds),
      supabase.from("results").select("id, session_id, single_digit, patti, version_no").in("session_id", sessionIds).eq("is_current", true).eq("status", "DECLARED"),
      supabase.from("bet_items").select("session_id, bet_id, stake, status").in("session_id", sessionIds).eq("status", "ACTIVE"),
    ]);
    if (gamesResult.error) throw gamesResult.error;
    if (resultsResult.error) throw resultsResult.error;
    if (betItemsResult.error) throw betItemsResult.error;
    const gameMap = new Map((gamesResult.data || []).map((game) => [String(game.id), String(game.game_name || "Game")]));
    const resultMap = new Map((resultsResult.data || []).map((result) => [String(result.session_id), result]));
    const aggregateMap = new Map<string, { betIds: Set<string>; exposure: number }>();
    for (const item of betItemsResult.data || []) {
      const key = String(item.session_id);
      const current = aggregateMap.get(key) || { betIds: new Set<string>(), exposure: 0 };
      current.exposure += Number(item.stake || 0);
      if (item.bet_id) current.betIds.add(String(item.bet_id));
      aggregateMap.set(key, current);
    }
    setSettlementSessions(sessionRows.map((session) => {
      const result = resultMap.get(String(session.id));
      const aggregate = aggregateMap.get(String(session.id));
      return { id: String(session.id), session_code: String(session.session_code || ""), game_name: gameMap.get(String(session.game_id)) || "Game", session_date: String(session.session_date || ""), bazi_no: session.bazi_no == null ? null : Number(session.bazi_no), market: String(session.market || ""), result_id: String(result?.id || ""), single_digit: String(result?.single_digit ?? ""), patti: String(result?.patti ?? ""), active_bets: aggregate?.betIds.size || 0, exposure: aggregate?.exposure || 0 };
    }).filter((row) => row.result_id));
  } catch (error: any) {
    console.error("=== SETTLEMENT MODULE LOAD ERROR ===", error);
    setAdminError(error?.message || String(error));
  } finally { setSettlementLoading(false); }
};

const settleSelectedSession = async (session: { id: string; game_name: string; bazi_no: number | null; market: string }) => {
  if (!window.confirm(`Settle ${session.game_name}${session.bazi_no != null ? ` Bazi ${session.bazi_no}` : ` ${session.market}`} now?\n\nOnly the declared result for this session will be settled.`)) return;
  setSettlementLoading(true); setAdminError(""); setAdminSuccess("");
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const settledBy = userData.user?.id;
    if (!settledBy) throw new Error("Super Admin session is missing. Please log in again.");
    const { error } = await supabase.rpc("settle_game_session", { p_session_id: session.id, p_settled_by: settledBy });
    if (error) throw error;
    setAdminSuccess(`Settlement completed successfully for ${session.game_name}${session.bazi_no != null ? ` Bazi ${session.bazi_no}` : ` ${session.market}`}.`);
    await loadSettlementModule();
    await loadSuperAdminDashboard();
  } catch (error: any) {
    console.error("=== SETTLEMENT ERROR ===", error);
    setAdminSuccess(""); setAdminError(error?.message || String(error));
  } finally { setSettlementLoading(false); }
};


const getBetAnalyzerSession = () =>
  betAnalyzerSessions.find((session) => String(session.id) === String(betAnalyzerSelectedSessionId)) ||
  betAnalyzerSelectedSession ||
  null;

const resetBetAnalyzerSelection = () => {
  setBetAnalyzerSelectedSessionId("");
  setBetAnalyzerSelectedSession(null);
  setBetAnalyzerRows([]);
  setBetAnalyzerHadLiveData(false);
};

const getBetAnalyzerBettingStatus = (session: any) => {
  if (!session?.opening_time || !session?.deadline_at) return "LOCKED";

  const nowMs = Date.now();
  const openingMs = new Date(session.opening_time).getTime();
  const deadlineMs = new Date(session.deadline_at).getTime();

  return nowMs >= openingMs && nowMs < deadlineMs
    ? "RUNNING"
    : "LOCKED";
};

const isBetAnalyzerSessionStarted = (session: any) => {
  if (!session?.opening_time) return false;

  const openingMs = new Date(session.opening_time).getTime();
  return Number.isFinite(openingMs) && Date.now() >= openingMs;
};

const loadBetAnalyzerSelectorSessions = async (
  targetDate = betAnalyzerDate,
  silent = false
) => {
  if (!silent) setBetAnalyzerLoading(true);
  setAdminError("");
  setAdminSuccess("");

  try {
    const { data: sessionRows, error: sessionError } = await supabase
      .from("game_sessions")
      .select("id, session_code, game_id, session_date, bazi_no, market, status, market_status, opening_time, deadline_at, scheduled_playable")
      .eq("session_date", targetDate)
      .eq("scheduled_playable", true)
      .order("opening_time", { ascending: true });

    if (sessionError) throw sessionError;

    const rows = sessionRows || [];
    const gameIds = [...new Set(rows.map((row: any) => row.game_id).filter(Boolean))];

    let gameMap = new Map<string, string>();

    if (gameIds.length > 0) {
      const { data: games, error: gamesError } = await supabase
        .from("games")
        .select("id, game_name")
        .in("id", gameIds);

      if (gamesError) throw gamesError;

      gameMap = new Map(
        (games || []).map((game: any) => [
          String(game.id),
          String(game.game_name || "Game"),
        ])
      );
    }

    const normalized = rows.map((row: any) => ({
      id: String(row.id),
      session_code: String(row.session_code || ""),
      game_id: String(row.game_id || ""),
      game_name: gameMap.get(String(row.game_id)) || "Game",
      session_date: String(row.session_date || ""),
      bazi_no: row.bazi_no == null ? null : Number(row.bazi_no),
      market: String(row.market || ""),
      status: String(row.status || ""),
      market_status: String(row.market_status || ""),
      opening_time: String(row.opening_time || ""),
      deadline_at: String(row.deadline_at || ""),
      scheduled_playable: Boolean(row.scheduled_playable),
    }));

    setBetAnalyzerSelectorSessions(normalized);

    const firstGame = normalized.find((row: any) => row.game_id)?.game_id || "";
    const selectedGameStillExists = normalized.some(
      (row: any) => String(row.game_id) === String(betAnalyzerGameId)
    );
    const nextGameId = selectedGameStillExists ? betAnalyzerGameId : firstGame;

    setBetAnalyzerGameId(nextGameId);

    const gameSessions = normalized.filter(
      (row: any) => String(row.game_id) === String(nextGameId)
    );

    const selectedBaziStillExists = gameSessions.some(
      (row: any) => String(row.id) === String(betAnalyzerBaziValue)
    );

    setBetAnalyzerBaziValue(
      selectedBaziStillExists
        ? betAnalyzerBaziValue
        : gameSessions[0]?.id || ""
    );
  } catch (error: any) {
    console.error("=== BET ANALYZER SELECTOR LOAD ERROR ===", error);
    setAdminError(error?.message || String(error));
  } finally {
    if (!silent) setBetAnalyzerLoading(false);
  }
};

const checkBetAnalyzerLiveData = async (session: any) => {
  if (!session?.id) return false;

  const previousSession = getJodiPreviousSession(session, betAnalyzerSelectorSessions);
  const sessionIds = [
    String(session.id),
    previousSession ? String(previousSession.id) : "",
  ].filter(Boolean);

  const { data: items, error } = await supabase
    .from("bet_items")
    .select("session_id, bet_type, stake, status")
    .in("session_id", sessionIds)
    .in("bet_type", ["Single", "Single Patti", "Double Patti", "Triple Patti", "Jodi"]);

  if (error) throw error;

  return (items || []).some((item: any) => {
    const sessionId = String(item.session_id);
    const status = String(item.status || "").toUpperCase();
    const stake = Number(item.stake || 0);

    if (stake <= 0) return false;
    if (sessionId === String(session.id)) return status === "ACTIVE";

    return (
      sessionId === String(previousSession?.id || "") &&
      String(item.bet_type || "") === "Jodi" &&
      status === "ACTIVE"
    );
  });
};

const analyzeSelectedBetAnalyzerSession = async () => {
  const session = betAnalyzerSelectorSessions.find(
    (row: any) => String(row.id) === String(betAnalyzerBaziValue)
  );

  if (!session?.id) {
    setAdminError("Please select Game, Bazi and Date first.");
    return;
  }

  setBetAnalyzerSelectedSessionId(String(session.id));
  setBetAnalyzerSelectedSession(session);
  setBetAnalyzerSessions([session]);
  setBetAnalyzerRows([]);
  setAdminError("");
  setAdminSuccess("");
  setBetAnalyzerOpenPanel("SINGLE");

  try {
    setBetAnalyzerHadLiveData(await checkBetAnalyzerLiveData(session));
  } catch (error: any) {
    setAdminError(error?.message || String(error));
    return;
  }

  await loadBetAnalyzerModule("SINGLE", session);
};

const getJodiPreviousSession = (
  session: any,
  allSessions: any[]
) => {
  const sameDate = (candidate: any) =>
    String(candidate.session_date || "") === String(session.session_date || "") &&
    String(candidate.game_id || "") === String(session.game_id || "");

  const gameName = String(session.game_name || "").trim().toLowerCase();

  if (gameName === "main bazar") {
    if (String(session.market || "").toUpperCase() !== "CLOSE") return null;

    return (
      allSessions.find(
        (candidate: any) =>
          sameDate(candidate) &&
          String(candidate.market || "").toUpperCase() === "OPEN"
      ) || null
    );
  }

  if (session.bazi_no == null || Number(session.bazi_no) <= 1) {
    return null;
  }

  return (
    allSessions.find(
      (candidate: any) =>
        sameDate(candidate) &&
        candidate.bazi_no != null &&
        Number(candidate.bazi_no) === Number(session.bazi_no) - 1
    ) || null
  );
};

const getJodiNextSession = (
  session: any,
  allSessions: any[]
) => {
  const sameDate = (candidate: any) =>
    String(candidate.session_date || "") === String(session.session_date || "") &&
    String(candidate.game_id || "") === String(session.game_id || "");

  const gameName = String(session.game_name || "").trim().toLowerCase();

  if (gameName === "main bazar") {
    if (String(session.market || "").toUpperCase() !== "OPEN") return null;

    return (
      allSessions.find(
        (candidate: any) =>
          sameDate(candidate) &&
          String(candidate.market || "").toUpperCase() === "CLOSE"
      ) || null
    );
  }

  if (session.bazi_no == null) return null;

  return (
    allSessions.find(
      (candidate: any) =>
        sameDate(candidate) &&
        candidate.bazi_no != null &&
        Number(candidate.bazi_no) === Number(session.bazi_no) + 1
    ) || null
  );
};

const loadBetAnalyzerModule = async (
  mode: "SINGLE" | "PATTI",
  selectedSession?: any,
  silent = false
) => {
  const session = selectedSession || getBetAnalyzerSession();

  if (!session?.id) {
    setAdminError("Please select an available session first.");
    return;
  }

  if (!silent) setBetAnalyzerLoading(true);
  setAdminError("");
  setAdminSuccess("");

  try {
    const sessionId = String(session.id);
    const betTypeFilter =
      mode === "SINGLE"
        ? ["Single"]
        : ["Single Patti", "Double Patti", "Triple Patti"];

    const { data: items, error: itemsError } = await supabase
      .from("bet_items")
      .select("session_id, bet_id, bet_type, played_number, stake, status")
      .eq("session_id", sessionId)
      .eq("status", "ACTIVE")
      .in("bet_type", betTypeFilter);

    if (itemsError) throw itemsError;

    const aggregate = new Map<
      string,
      { played_number: string; total_stake: number }
    >();

    for (const item of items || []) {
      const playedNumber = String(item.played_number ?? "").trim();
      if (!playedNumber) continue;

      const current =
        aggregate.get(playedNumber) || {
          played_number: playedNumber,
          total_stake: 0,
        };

      current.total_stake += Number(item.stake || 0);
      aggregate.set(playedNumber, current);
    }

    const activeRows = [...aggregate.values()]
      .filter((row) => row.total_stake > 0)
      .sort(
        (a, b) =>
          b.total_stake - a.total_stake ||
          a.played_number.localeCompare(b.played_number)
      );

    if (mode === "SINGLE" && activeRows.length > 0) {
      const amountByNumber = new Map(
        activeRows.map((row) => [String(row.played_number), row.total_stake])
      );

      setBetAnalyzerRows(
        Array.from({ length: 10 }, (_, index) => {
          const number = String(index);
          return {
            session_id: sessionId,
            game_name: session.game_name,
            session_date: session.session_date,
            bazi_no: session.bazi_no,
            market: session.market,
            session_code: session.session_code,
            bet_type: "SINGLE",
            played_number: number,
            total_stake: Number(amountByNumber.get(number) || 0),
          };
        })
      );
    } else {
      setBetAnalyzerRows(
        activeRows.map((row) => ({
          session_id: sessionId,
          game_name: session.game_name,
          session_date: session.session_date,
          bazi_no: session.bazi_no,
          market: session.market,
          session_code: session.session_code,
          bet_type: mode,
          played_number: row.played_number,
          total_stake: row.total_stake,
        }))
      );
    }
  } catch (error: any) {
    console.error("=== BET ANALYZER MODULE LOAD ERROR ===", error);
    setAdminError(error?.message || String(error));
  } finally {
    if (!silent) setBetAnalyzerLoading(false);
  }
};

const loadJodiAnalyzerModule = async (
  selectedSession?: any,
  silent = false
) => {
  const session = selectedSession || getBetAnalyzerSession();

  if (!session?.id) {
    setAdminError("Please select an available session first.");
    return;
  }

  if (!silent) setBetAnalyzerLoading(true);
  setAdminError("");
  setAdminSuccess("");

  try {
    const currentSessionId = String(session.id);
    const allSessions = betAnalyzerSelectorSessions;
    const previousSession = getJodiPreviousSession(session, allSessions);
    const nextSession = getJodiNextSession(session, allSessions);
    const previousSessionId = previousSession
      ? String(previousSession.id)
      : "";

    const sessionIds = [currentSessionId, previousSessionId].filter(Boolean);

    const { data: items, error: itemsError } = await supabase
      .from("bet_items")
      .select("session_id, bet_type, played_number, stake, status")
      .in("session_id", sessionIds)
      .eq("bet_type", "Jodi");

    if (itemsError) throw itemsError;

    const previousItems = (items || []).filter(
      (item: any) =>
        String(item.session_id) === previousSessionId &&
        !["REFUNDED", "REVERSED"].includes(
          String(item.status || "").toUpperCase()
        ) &&
        Number(item.stake || 0) > 0
    );

    const currentItems = (items || []).filter(
      (item: any) =>
        String(item.session_id) === currentSessionId &&
        String(item.status || "").toUpperCase() === "ACTIVE" &&
        Number(item.stake || 0) > 0
    );

    const aggregate = (
      sourceItems: any[],
      section: "PREVIOUS" | "FORWARD"
    ) => {
      const map = new Map<
        string,
        { played_number: string; total_stake: number }
      >();

      for (const item of sourceItems) {
        const playedNumber = String(item.played_number ?? "").trim();
        if (!playedNumber) continue;

        const current = map.get(playedNumber) || {
          played_number: playedNumber,
          total_stake: 0,
        };

        current.total_stake += Number(item.stake || 0);
        map.set(playedNumber, current);
      }

      return [...map.values()]
        .filter((row) => row.total_stake > 0)
        .sort(
          (a, b) =>
            b.total_stake - a.total_stake ||
            a.played_number.localeCompare(b.played_number)
        )
        .map((row) => ({
          session_id: currentSessionId,
          game_name: session.game_name,
          session_date: session.session_date,
          bazi_no: session.bazi_no,
          market: session.market,
          session_code: session.session_code,
          bet_type: "Jodi",
          played_number: row.played_number,
          total_stake: row.total_stake,
          section,
        }));
    };

    const rows: any[] = [];

    if (previousSession) {
      rows.push(...aggregate(previousItems, "PREVIOUS"));
    }

    if (nextSession) {
      rows.push(...aggregate(currentItems, "FORWARD"));
    }

    setBetAnalyzerRows(rows);
  } catch (error: any) {
    console.error("=== JODI ANALYZER MODULE LOAD ERROR ===", error);
    setAdminError(error?.message || String(error));
  } finally {
    if (!silent) setBetAnalyzerLoading(false);
  }
};

useEffect(() => {
  if (adminModule !== "BET_ANALYZER") return;
  void loadBetAnalyzerSelectorSessions(betAnalyzerDate, true);
}, [adminModule, betAnalyzerDate]);

useEffect(() => {
  if (adminModule !== "BET_ANALYZER" || betAnalyzerView !== "ANALYZER") return;

  const timer = setInterval(async () => {
    const session = getBetAnalyzerSession();
    if (!session?.id) return;

    try {
      const hasLiveData = await checkBetAnalyzerLiveData(session);

      if (hasLiveData) {
        if (!betAnalyzerHadLiveData) setBetAnalyzerHadLiveData(true);
      } else if (betAnalyzerHadLiveData) {
        resetBetAnalyzerSelection();
        return;
      }
    } catch (error: any) {
      console.error("=== BET ANALYZER LIVE STATE CHECK ERROR ===", error);
      return;
    }

    if (betAnalyzerOpenPanel === "SINGLE") {
      void loadBetAnalyzerModule("SINGLE", session, true);
      return;
    }

    if (betAnalyzerOpenPanel === "PATTI") {
      void loadBetAnalyzerModule("PATTI", session, true);
      return;
    }

    if (betAnalyzerOpenPanel === "JODI") {
      void loadJodiAnalyzerModule(session, true);
    }
  }, 2000);

  return () => clearInterval(timer);
}, [
  adminModule,
  betAnalyzerView,
  betAnalyzerSelectedSessionId,
  betAnalyzerSelectedSession,
  betAnalyzerOpenPanel,
  betAnalyzerSelectorSessions,
  betAnalyzerHadLiveData,
]);

const renderBetAnalyzerSessionContext = () => {
  const session = getBetAnalyzerSession();
  if (!session) return null;

  return (
    <div
      className="bet-analyzer-session-header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: "220px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          className={`public-game-selector-icon ${
            String(session.game_name || "").trim().toLowerCase() === "main bazar"
              ? "main"
              : String(session.game_name || "").trim().toLowerCase() === "kolkata fatafat"
                ? "kolkata"
                : "dus"
          }`}
        >
          {String(session.game_name || "").trim().toLowerCase() === "main bazar"
            ? "♛"
            : String(session.game_name || "").trim().toLowerCase() === "kolkata fatafat"
              ? "♜"
              : "🎲"}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <b>{session.game_name}{session.bazi_no != null ? ` - Bazi ${session.bazi_no}` : ` - ${session.market}`}</b>
          <small>
            DATE: {session.session_date
              ? new Date(`${session.session_date}T00:00:00`).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-"}
            {" • "}SESSION: {session.session_code}
            {" • "}{String(session.market || "").toUpperCase()}
          </small>
          <small>
            DEADLINE: {session.deadline_at
              ? new Date(session.deadline_at).toLocaleTimeString("en-IN", {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "-"}
          </small>
        </div>
      </div>
      <span className={`admin-status ${getBetAnalyzerBettingStatus(session) === "RUNNING" ? "active" : ""}`}>
        {getBetAnalyzerBettingStatus(session) === "RUNNING"
          ? "BETTING RUNNING"
          : "BETTING LOCKED"}
      </span>
    </div>
  );
};

const renderSuperAdminArea = () => (
<div className="admin-shell">
<header className="admin-header">
<div>
<div className="admin-brand">APNA MATKA</div>
<div className="admin-subtitle">SUPER ADMIN CONTROL PANEL</div>
</div>

<div className="admin-header-actions">
<span className="admin-role-badge">SUPER ADMIN</span>
<button className="admin-logout-btn" onClick={logoutCustomer}>LOGOUT</button>
</div>
</header>

<main className="admin-main">

<section className="admin-welcome-card">
<div>
<div className="admin-section-kicker">CONTROL CENTER</div>
<h1>{adminModule === "AGENT_ADMIN" ? "Agent Admin" : adminModule === "ACCOUNT_OVERVIEW" ? "Account Overview" : adminModule === "ACCOUNT_DIRECTORY" ? "Customer & Admin All Accounts" : adminModule === "AGENT_WALLET" && agentWalletAction === "DEPOSIT" ? "Deposit Virtual USD" : adminModule === "AGENT_WALLET" && agentWalletAction === "WITHDRAW" ? "Withdraw Virtual USD" : adminModule === "AGENT_WALLET" ? "Agent Wallet" : adminModule === "DEPOSIT_AGENT" ? "Deposit Virtual USD" : adminModule === "WITHDRAW_AGENT" ? "Withdraw Virtual USD" : adminModule === "ONLINE_CUSTOMER" ? "Online Customer Wallet" : adminModule === "RESULTS" ? "Results" : adminModule === "SETTLEMENT" ? "Settlement" : adminModule === "BET_ANALYZER" ? "Bet Analyzer" : adminModule === "CONTACT" ? "Contact" : adminModule === "PASSWORD_RESET" ? "Password Reset" : "Super Admin Dashboard"}</h1>
<p>
{adminModule === "AGENT_ADMIN"
  ? "Create and manage Agent Admin accounts."
  : adminModule === "ACCOUNT_OVERVIEW"
    ? "Virtual USD supply, distribution, balances and exposure overview."
    : adminModule === "AGENT_WALLET"
      ? "Deposit and withdraw virtual USD with Agent Admin wallets."
      : adminModule === "DEPOSIT_AGENT"
        ? "Transfer virtual USD from Super Admin supply to an Agent Admin wallet."
        : adminModule === "WITHDRAW_AGENT"
          ? "Return virtual USD from an Agent Admin wallet to Super Admin supply."
          : adminModule === "ONLINE_CUSTOMER"
            ? "Deposit and withdraw virtual USD with Online Customers only."
            : adminModule === "RESULTS"
              ? "Declare official game results for the selected session."
              : adminModule === "SETTLEMENT"
                ? "Settle result-declared game sessions and release customer exposure."
              : adminModule === "BET_ANALYZER"
                ? "Select Game, Bazi and Date to analyze live betting activity."
              : adminModule === "AUDIT"
                ? "Traceable activity history from the verified audit trail."
              : "Manage agents, customers, virtual coin wallets, results, settlement and reports."}
</p>
</div>

<button
className="admin-refresh-btn"
onClick={() => {
  if (adminModule === "AGENT_WALLET" && agentWalletAction !== null) {
    setAgentWalletAction(null);
    setAdminError("");
  } else if (adminModule === "AGENT_WALLET") {
    setAdminModule("HOME");
    setAdminError("");
  } else if (adminModule === "RESULTS" || adminModule === "SETTLEMENT") {
    setAdminModule("HOME");
    setAdminError("");
    setAdminSuccess("");
  } else if (adminModule === "REPORTS") {
    setAdminModule("HOME");
    setReportsRows([]);
    setReportsPage(0);
    setReportsTotal(0);
    setAdminError("");
    setAdminSuccess("");
  } else if (adminModule === "AUDIT") {
    setAdminModule("HOME");
    setAuditTransactionRows([]);
    setAuditSettlementRows([]);
    setAuditTransactionHasNext(false);
    setAuditSettlementHasNext(false);
    setAdminError("");
    setAdminSuccess("");
  } else if (adminModule === "BET_ANALYZER") {
    if (betAnalyzerView !== "HOME") {
      setBetAnalyzerView("HOME");
      resetBetAnalyzerSelection();
      setAdminError("");
      setAdminSuccess("");
    } else {
      setAdminModule("HOME");
      setAdminError("");
      setAdminSuccess("");
    }
  } else if (adminModule !== "HOME") {
    setAdminModule("HOME");
    setAdminError("");
  } else {
    loadSuperAdminDashboard();
  }
}}
disabled={adminModule === "HOME" && adminLoading}
>
{adminModule !== "HOME"
  ? "BACK"
  : adminLoading
    ? "LOADING..."
    : "REFRESH"}
</button>
</section>

{adminSuccess ? <div className="admin-success">{adminSuccess}</div> : null}
{adminError ? <div className="admin-error">{adminError}</div> : null}

{adminModule === "HOME" ? (
<>
<section className="admin-stat-grid">
<div className="admin-stat-card"><span>AGENTS</span><strong>{adminStats.agents}</strong></div>
<div className="admin-stat-card"><span>CUSTOMERS</span><strong>{adminStats.customers}</strong></div>
<div className="admin-stat-card"><span>ONLINE CUSTOMERS</span><strong>{adminStats.onlineCustomers}</strong></div>
<div className="admin-stat-card"><span>SUPER ADMIN AVAILABLE</span><strong className="admin-available-value">${adminStats.available.toFixed(2)}</strong></div>
<div className="admin-stat-card"><span>NETWORK EXPOSURE</span><strong className="admin-exposure-value">${adminStats.exposure.toFixed(2)}</strong></div>
</section>
<section className="admin-module-grid admin-home-modules">
<button className="admin-module-card" onClick={()=>{setAdminModule("ACCOUNT_OVERVIEW");setAdminError("");setAdminSuccess("");}}><b>Account Overview</b><small>Supply, network balances & exposure</small></button>
<button className="admin-module-card" onClick={()=>{setAdminModule("CONTACT");setAdminError("");setAdminSuccess("");void loadContactSettings();}}><b>Contact</b><small>WhatsApp & Telegram links</small></button>
<button className="admin-module-card" onClick={()=>{setAdminModule("ACCOUNT_DIRECTORY");setSuperAdminAccountView(null);setSuperAdminAccountSearch("");setSuperAdminAccountPage(1);setSelectedAdminAccount(null);setAdminError("");setAdminSuccess("");}}><b>Customer & Admin All Accounts</b><small>Customer accounts and Agent Admin accounts</small></button>
<button className="admin-module-card" onClick={()=>{setAdminModule("AGENT_WALLET");setAgentWalletAction(null);setAllocationAgentProfileId("");setAllocationAmount("");setAllocationNote("");setAdminError("");}}><b>Agent Wallet</b><small>Deposit / withdraw virtual USD</small></button>
<button className="admin-module-card" onClick={()=>{setAdminModule("ONLINE_CUSTOMER");setAdminError("");setOnlineCoinCustomerId("");setOnlineCoinAmount("");}}><b>Online Customer Wallet</b><small>Deposit / withdraw virtual USD</small></button>
<button className="admin-module-card" onClick={()=>{setAdminModule("AGENT_ADMIN");setAdminError("");}}><b>Agent Admin</b><small>Create Agent Admin accounts</small></button>
<button className="admin-module-card" onClick={()=>{setAdminModule("PASSWORD_RESET");setAdminPasswordResetTarget("");setAdminPasswordResetPassword("");setAdminError("");setAdminSuccess("");}}><b>Password Reset</b><small>Agent Admin + Online Customer password reset</small></button>
<button className="admin-module-card" onClick={()=>{setAdminModule("RESULTS");setResultGameId("");setResultDate("");setResultSessionId("");setResultSingleDigit("");setResultPatti("");setResultCurrent(null);setAdminError("");setAdminSuccess("");void loadResultsModule();}}><b>Results</b><small>Declare game results</small></button>
{[["Settlement","Settle market / Bazi"],["Bet Analyzer","Single / Patti / Jodi analysis"],["Reports","Betting activity reports"],["Audit","Traceable activity history"]].map(([title,sub])=><button key={title} className="admin-module-card" onClick={()=>{if(title==="Settlement"){setAdminModule("SETTLEMENT");setAdminError("");setAdminSuccess("");void loadSettlementModule();}else if(title==="Bet Analyzer"){setAdminModule("BET_ANALYZER");setBetAnalyzerView("ANALYZER");setBetAnalyzerRows([]);setBetAnalyzerOpenPanel("SINGLE");setBetAnalyzerDate(getLocalDateString());setBetAnalyzerGameId("");setBetAnalyzerBaziValue("");setBetAnalyzerSelectedSessionId("");setBetAnalyzerSelectedSession(null);setBetAnalyzerHadLiveData(false);setAdminError("");setAdminSuccess("");}else if(title==="Reports"){setAdminModule("REPORTS");setReportsRows([]);setReportsPage(0);setReportsTotal(0);setAdminError("");setAdminSuccess("");void loadSuperAdminReports(0);}else if(title==="Audit"){setAdminModule("AUDIT");setAuditView("HOME");setAuditTransactionRows([]);setAuditSettlementRows([]);setAuditTransactionPage(0);setAuditSettlementPage(0);setAuditTransactionHasNext(false);setAuditSettlementHasNext(false);setAdminError("");setAdminSuccess("");}else setAdminError(`${title} module is the next build step.`);}}><b>{title}</b><small>{sub}</small></button>)}
</section>
<section className="admin-supply-card">
<div className="admin-section-kicker">VIRTUAL COIN CONTROL</div>
<h2>Super Admin Supply Target</h2>
<p>
Target supply: <b>1,000,000 virtual USD coins</b>. Use the Agent Wallet and Online Customer Wallet modules for account transfers.
</p>
</section>
</>
 ) : adminModule === "PASSWORD_RESET" ? (
<section className="admin-panel-card">
  <div className="admin-panel-title-row"><div className="admin-panel-title">PASSWORD RESET</div><button className="admin-small-action" type="button" onClick={()=>setAdminModule("HOME")}>BACK</button></div>
  <div className="admin-module-grid">
    <button className={`admin-module-card ${superAdminAccountView==="AGENT"?"active":""}`} type="button" onClick={()=>{setSuperAdminAccountView("AGENT");setAdminPasswordResetTarget("");void loadSuperAdminAccountDirectory("AGENT");}}> <b>Admin Agent Password Reset</b><small>Select Agent Admin and set a new password.</small></button>
    <button className={`admin-module-card ${superAdminAccountView==="CUSTOMER"?"active":""}`} type="button" onClick={()=>{setSuperAdminAccountView("CUSTOMER");setAdminPasswordResetTarget("");void loadSuperAdminAccountDirectory("CUSTOMER");}}> <b>Online Customer Password Reset</b><small>Select only Online Customers and set a new password.</small></button>
  </div>
  {superAdminAccountView ? <div className="admin-form">
    <div className="admin-form-field"><label>{superAdminAccountView==="AGENT"?"AGENT ADMIN":"ONLINE CUSTOMER"}</label><select className="admin-form-input" value={adminPasswordResetTarget} onChange={(e)=>setAdminPasswordResetTarget(e.target.value)}><option value="">Select account</option>{(superAdminAccountView==="AGENT"?superAdminAgentAccounts:superAdminCustomerAccounts.filter((c:any)=>c.source==="ONLINE")).filter((a:any)=>a.status!=="DELETED").map((a:any)=><option key={a.profile_id} value={a.profile_id}>{a.username} — {superAdminAccountView==="AGENT"?a.agent_code:a.customer_code}</option>)}</select></div>
    <div className="admin-form-field"><label>NEW PASSWORD</label><input className="admin-form-input" type="password" value={adminPasswordResetPassword} onChange={(e)=>setAdminPasswordResetPassword(e.target.value)} maxLength={16} placeholder="8–16 characters" /></div>
    <div className="admin-form-note">Backend password-reset action will be connected in the next backend step. No password is changed by this UI yet.</div>
  </div> : null}
</section>
) : adminModule === "CONTACT" ? (
<>
<section className="admin-panel-card">
  <div className="admin-panel-title">CONTACT SETTINGS</div>
  <p className="admin-account-detail-intro">Set the WhatsApp and Telegram links used by the public homepage support buttons.</p>

  <div className="admin-form">
    <div className="admin-form-field">
      <label>WHATSAPP LINK</label>
      <input
        className="admin-form-input"
        type="url"
        value={contactWhatsappLink}
        onChange={(e) => setContactWhatsappLink(e.target.value)}
        placeholder="https://..."
        maxLength={500}
        disabled={contactLoading}
      />
    </div>

    <div className="admin-form-field">
      <label>TELEGRAM LINK</label>
      <input
        className="admin-form-input"
        type="url"
        value={contactTelegramLink}
        onChange={(e) => setContactTelegramLink(e.target.value)}
        placeholder="https://..."
        maxLength={500}
        disabled={contactLoading}
      />
    </div>

    <div className="admin-form-note">Leave a link empty to disable that homepage contact button.</div>

    <button
      className="admin-create-btn"
      type="button"
      onClick={saveContactSettings}
      disabled={contactLoading || adminLoading}
    >
      {contactLoading ? "SAVING..." : "SAVE"}
    </button>
  </div>
</section>
</>
 ) : adminModule === "RESULTS" ? (
<>
<section className="admin-panel-card">
  <div className="admin-panel-title">DECLARE GAME RESULT</div>
  <p className="admin-account-detail-intro">
    Select the Game, Date and Bazi / Market session, then enter the official Single Digit and Patti.
  </p>

  <div className="admin-form">
    <div className="admin-form-field">
      <label>GAME</label>
      <select
        className="admin-form-input"
        value={resultGameId}
        onChange={(e) => {
          setResultGameId(e.target.value);
          setResultSessionId("");
          setResultCurrent(null);
          setAdminError("");
          setAdminSuccess("");
        }}
        disabled={adminLoading}
      >
        <option value="">Select Game</option>
        {resultGames.map((game) => (
          <option key={game.id} value={game.id}>{game.game_name} ({game.game_code})</option>
        ))}
      </select>
    </div>

    <div className="admin-form-field">
      <label>DATE</label>
      <input
        className="admin-form-input"
        type="date"
        value={resultDate}
        onChange={(e) => {
          setResultDate(e.target.value);
          setResultSessionId("");
          setResultCurrent(null);
          setAdminError("");
          setAdminSuccess("");
        }}
        disabled={adminLoading}
      />
    </div>

    <div className="admin-form-field">
      <label>BAZI / MARKET SESSION</label>
      <select
        className="admin-form-input"
        value={resultSessionId}
        onChange={(e) => {
          const id = e.target.value;
          setResultSessionId(id);
          setAdminError("");
          setAdminSuccess("");
          void loadCurrentResult(id);
        }}
        disabled={adminLoading || !resultGameId || !resultDate}
      >
        <option value="">Select Session</option>
        {resultSessions
          .filter((session) => session.game_id === resultGameId && session.session_date === resultDate)
          .map((session) => (
            <option key={session.id} value={session.id}>
              {session.bazi_no != null ? `Bazi ${session.bazi_no}` : session.market} • {session.market} • {session.session_code}
            </option>
          ))}
      </select>
    </div>

    {resultSessionId ? (
      <div className="admin-form-note">
        {(() => {
          const session = resultSessions.find((item) => item.id === resultSessionId);
          if (!session) return "Selected session.";
          return `Session: ${session.session_code} • ${session.status} • ${session.market_status}`;
        })()}
      </div>
    ) : null}

    {resultCurrent ? (
      <div className="admin-form-note" style={{ border: "1px solid rgba(50,220,120,.25)", color: "#55ee9a" }}>
        Current Result: <b>{resultCurrent.single_digit} / {resultCurrent.patti}</b> • Version {resultCurrent.version_no} • {resultCurrent.status}
      </div>
    ) : null}

    <div className="admin-form-field">
      <label>SINGLE DIGIT</label>
      <input
        className="admin-form-input"
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={resultSingleDigit}
        onChange={(e) => setResultSingleDigit(e.target.value.replace(/\D/g, "").slice(0, 1))}
        placeholder="0 - 9"
        disabled={adminLoading || Boolean(resultCurrent)}
      />
    </div>

    <div className="admin-form-field">
      <label>PATTI</label>
      <input
        className="admin-form-input"
        type="text"
        inputMode="numeric"
        maxLength={3}
        value={resultPatti}
        onChange={(e) => setResultPatti(e.target.value.replace(/\D/g, "").slice(0, 3))}
        placeholder="3 digit Patti"
        disabled={adminLoading || Boolean(resultCurrent)}
      />
    </div>

    <div className="admin-form-note">
      Result declaration uses the existing secure <b>declare_game_result()</b> function. Settlement is not triggered by this screen yet; it remains a separate verified backend operation.
    </div>

    <button
      className="admin-create-btn"
      type="button"
      onClick={declareSelectedGameResult}
      disabled={adminLoading || !resultSessionId || Boolean(resultCurrent)}
    >
      {adminLoading ? "DECLARING..." : resultCurrent ? "RESULT ALREADY DECLARED" : "DECLARE RESULT"}
    </button>
  </div>
</section>

<section className="admin-panel-card">
  <div className="admin-panel-title">SESSION RULE</div>
  <div className="admin-form-note">
    One official result is declared for the selected session. Existing declared results are protected by the backend duplicate-declaration check.
  </div>
</section>
</>
  ) : adminModule === "BET_ANALYZER" ? (
<>
<section className="admin-panel-card">
  <div className="admin-panel-title-row">
    <div className="admin-panel-title">BET ANALYZER</div>
  </div>

  <div className="bet-analyzer-selector-grid">
    <div className="admin-form-field">
      <label>SELECT GAME</label>
      <select
        className="admin-form-input"
        value={betAnalyzerGameId}
        onChange={(e) => {
          const gameId = e.target.value;
          setBetAnalyzerGameId(gameId);
          const gameSessions = betAnalyzerSelectorSessions.filter(
            (session: any) => String(session.game_id) === String(gameId)
          );
          setBetAnalyzerBaziValue(gameSessions[0]?.id || "");
          setBetAnalyzerSelectedSessionId("");
          setBetAnalyzerSelectedSession(null);
          setBetAnalyzerRows([]);
        }}
      >
        <option value="">Select Game</option>
        {[...new Map(
          betAnalyzerSelectorSessions.map((session: any) => [
            String(session.game_id),
            session.game_name,
          ])
        )].map(([gameId, gameName]) => (
          <option key={String(gameId)} value={String(gameId)}>
            {String(gameName)}
          </option>
        ))}
      </select>
    </div>

    <div className="admin-form-field">
      <label>SELECT BAZI</label>
      <select
        className="admin-form-input"
        value={betAnalyzerBaziValue}
        onChange={(e) => {
          setBetAnalyzerBaziValue(e.target.value);
          setBetAnalyzerSelectedSessionId("");
          setBetAnalyzerSelectedSession(null);
          setBetAnalyzerRows([]);
        }}
        disabled={!betAnalyzerGameId}
      >
        <option value="">Select Bazi</option>
        {betAnalyzerSelectorSessions
          .filter((session: any) => String(session.game_id) === String(betAnalyzerGameId))
          .map((session: any) => (
            <option key={session.id} value={session.id}>
              {session.bazi_no != null ? `Bazi ${session.bazi_no}` : String(session.market || "").toUpperCase()}
            </option>
          ))}
      </select>
    </div>

    <div className="admin-form-field">
      <label>SELECT DATE</label>
      <input
        className="admin-form-input"
        type="date"
        value={betAnalyzerDate}
        onChange={(e) => {
          const nextDate = e.target.value || getLocalDateString();
          setBetAnalyzerDate(nextDate);
          setBetAnalyzerSelectedSessionId("");
          setBetAnalyzerSelectedSession(null);
          setBetAnalyzerRows([]);
          setBetAnalyzerGameId("");
          setBetAnalyzerBaziValue("");
        }}
      />
    </div>

    <button
      type="button"
      className="admin-create-btn bet-analyzer-analyze-btn"
      onClick={() => void analyzeSelectedBetAnalyzerSession()}
      disabled={betAnalyzerLoading || !betAnalyzerGameId || !betAnalyzerBaziValue}
    >
      ANALYZE
    </button>
  </div>
</section>

{getBetAnalyzerSession() ? (
  <>
    <section className="admin-panel-card">
      {renderBetAnalyzerSessionContext()}
    </section>

    <section className="admin-panel-card bet-analyzer-section">
      <button
        type="button"
        className={`bet-analyzer-accordion ${betAnalyzerOpenPanel === "SINGLE" ? "open" : ""}`}
        onClick={() => {
          const nextPanel = betAnalyzerOpenPanel === "SINGLE" ? null : "SINGLE";
          setBetAnalyzerOpenPanel(nextPanel);
          const session = getBetAnalyzerSession();
          if (nextPanel === "SINGLE" && session) {
            void loadBetAnalyzerModule("SINGLE", session);
          }
        }}
      >
        <span>
          <b>SINGLE ANALYZER</b>
          <small>Analyze Single betting activity.</small>
        </span>
        <strong>{betAnalyzerOpenPanel === "SINGLE" ? "⌃" : "⌄"}</strong>
      </button>

      {betAnalyzerOpenPanel === "SINGLE" ? (
        <div className="bet-analyzer-content">
          {betAnalyzerLoading ? (
            <div className="admin-empty">LOADING ANALYSIS...</div>
          ) : betAnalyzerRows.length === 0 ? (
            <div className="admin-empty">
              No active Single bets are available for this session.
            </div>
          ) : (
            <>
              <div className="bet-analyzer-rate-row">
                <span>Single Rate (Win 1 Number)</span>
                <strong>9X</strong>
              </div>

              <div className="bet-analyzer-grid">
                {betAnalyzerRows.map((row: any) => (
                  <div
                    className={`bet-analyzer-number-card ${Number(row.total_stake || 0) > 0 ? "has-bet" : "no-bet"}`}
                    key={`single-${row.played_number}`}
                  >
                    <b>{row.played_number}</b>
                    <strong>${Number(row.total_stake || 0).toFixed(2)}</strong>
                    <small>
                      Total Stake: {Number(row.total_stake || 0) > 0
                        ? Number(row.total_stake || 0).toFixed(2)
                        : "0"}
                    </small>
                  </div>
                ))}
              </div>

              <div className="bet-analyzer-total">
                <span>TOTAL STAKE (SINGLE)</span>
                <strong>
                  ${betAnalyzerRows
                    .reduce((sum: number, row: any) => sum + Number(row.total_stake || 0), 0)
                    .toFixed(2)}
                </strong>
              </div>
            </>
          )}
        </div>
      ) : null}
    </section>

    <section className="admin-panel-card bet-analyzer-section">
      <button
        type="button"
        className={`bet-analyzer-accordion ${betAnalyzerOpenPanel === "PATTI" ? "open" : ""}`}
        onClick={() => {
          const nextPanel = betAnalyzerOpenPanel === "PATTI" ? null : "PATTI";
          setBetAnalyzerOpenPanel(nextPanel);
          const session = getBetAnalyzerSession();
          if (nextPanel === "PATTI" && session) {
            void loadBetAnalyzerModule("PATTI", session);
          }
        }}
      >
        <span>
          <b>PATTI ANALYZER</b>
          <small>Analyze Single Patti, Double Patti, Triple Patti betting activity.</small>
        </span>
        <strong>{betAnalyzerOpenPanel === "PATTI" ? "⌃" : "⌄"}</strong>
      </button>

      {betAnalyzerOpenPanel === "PATTI" ? (
        <div className="bet-analyzer-content">
          {betAnalyzerLoading ? (
            <div className="admin-empty">LOADING PATTI ANALYSIS...</div>
          ) : betAnalyzerRows.length === 0 ? (
            <div className="admin-empty">
              No active Patti bets are available for this session.
            </div>
          ) : (
            <>
              <div className="bet-analyzer-grid">
                {betAnalyzerRows.map((row: any) => (
                  <div className="bet-analyzer-number-card has-bet" key={`patti-${row.played_number}`}>
                    <b>{row.played_number}</b>
                    <strong>${Number(row.total_stake || 0).toFixed(2)}</strong>
                    <small>Total Stake: {Number(row.total_stake || 0).toFixed(2)}</small>
                  </div>
                ))}
              </div>

              <div className="bet-analyzer-total">
                <span>TOTAL STAKE (PATTI)</span>
                <strong>
                  ${betAnalyzerRows
                    .reduce((sum: number, row: any) => sum + Number(row.total_stake || 0), 0)
                    .toFixed(2)}
                </strong>
              </div>
            </>
          )}
        </div>
      ) : null}
    </section>

    <section className="admin-panel-card bet-analyzer-section">
      <button
        type="button"
        className={`bet-analyzer-accordion ${betAnalyzerOpenPanel === "JODI" ? "open" : ""}`}
        onClick={() => {
          const nextPanel = betAnalyzerOpenPanel === "JODI" ? null : "JODI";
          setBetAnalyzerOpenPanel(nextPanel);
          const session = getBetAnalyzerSession();
          if (nextPanel === "JODI" && session) {
            void loadJodiAnalyzerModule(session);
          }
        }}
      >
        <span>
          <b>JODI ANALYZER</b>
          <small>Analyze Jodi betting activity.</small>
        </span>
        <strong>{betAnalyzerOpenPanel === "JODI" ? "⌃" : "⌄"}</strong>
      </button>

      {betAnalyzerOpenPanel === "JODI" ? (
        <div className="bet-analyzer-content">
          {betAnalyzerLoading ? (
            <div className="admin-empty">LOADING JODI ANALYSIS...</div>
          ) : betAnalyzerRows.length === 0 ? (
            <div className="admin-empty">
              No active Jodi bets are available for this session.
            </div>
          ) : (
            <>
              {(() => {
                const session = getBetAnalyzerSession();
                const previousSession = session?.jodi_previous_session || getJodiPreviousSession(session, betAnalyzerSelectorSessions);
                const nextSession = session?.jodi_next_session || getJodiNextSession(session, betAnalyzerSelectorSessions);
                const gameName = String(session?.game_name || "").trim().toLowerCase();
                const isMainBazar = gameName === "main bazar";

                const previousRows = betAnalyzerRows.filter((row: any) => row.section === "PREVIOUS");
                const forwardRows = betAnalyzerRows.filter((row: any) => row.section === "FORWARD");

                const previousTitle = isMainBazar
                  ? "CARRY FORWARD FROM OPEN"
                  : previousSession
                    ? `PREVIOUS / CARRY FROM BAZI ${previousSession.bazi_no}`
                    : "PREVIOUS / CARRY";

                const forwardTitle = isMainBazar
                  ? "NEW / FORWARD TO CLOSE"
                  : nextSession
                    ? `NEW / FORWARD TO BAZI ${nextSession.bazi_no}`
                    : "NEW / FORWARD";

                const totalJodiStake = betAnalyzerRows.reduce(
                  (sum: number, row: any) => sum + Number(row.total_stake || 0),
                  0
                );

                return (
                  <>
                    {previousRows.length > 0 ? (
                      <div className="bet-analyzer-subsection">
                        <div className="bet-analyzer-subtitle">{previousTitle}</div>
                        <div className="bet-analyzer-grid">
                          {previousRows.map((row: any) => (
                            <div className="bet-analyzer-number-card has-bet" key={`previous-${row.played_number}`}>
                              <b>{row.played_number}</b>
                              <strong>${Number(row.total_stake || 0).toFixed(2)}</strong>
                              <small>Total Stake: {Number(row.total_stake || 0).toFixed(2)}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {forwardRows.length > 0 ? (
                      <div className="bet-analyzer-subsection">
                        <div className="bet-analyzer-subtitle">{forwardTitle}</div>
                        <div className="bet-analyzer-grid">
                          {forwardRows.map((row: any) => (
                            <div className="bet-analyzer-number-card has-bet" key={`forward-${row.played_number}`}>
                              <b>{row.played_number}</b>
                              <strong>${Number(row.total_stake || 0).toFixed(2)}</strong>
                              <small>Total Stake: {Number(row.total_stake || 0).toFixed(2)}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="bet-analyzer-total">
                      <span>TOTAL STAKE (JODI)</span>
                      <strong>${totalJodiStake.toFixed(2)}</strong>
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>
      ) : null}
    </section>
  </>
) : (
  <section className="admin-panel-card">
    <div className="admin-empty">
      Select Game, Bazi and Date, then press ANALYZE to view the selected session.
    </div>
  </section>
)}
</>
) : adminModule === "SETTLEMENT" ? (
<>
<section className="admin-panel-card">
  <div className="admin-panel-title">RESULT-DECLARED SESSIONS</div>
  <p className="admin-account-detail-intro">Only playable sessions with a current DECLARED result are shown here. Settlement will update the customer wallet, exposure, bet status and settlement records atomically.</p>
  {settlementLoading ? <div className="admin-empty">LOADING SETTLEMENT SESSIONS...</div> : settlementSessions.length === 0 ? <div className="admin-empty">No result-declared sessions are waiting for settlement.</div> : (
    <div className="admin-agent-list">
      {settlementSessions.map((session) => (
        <div className="admin-agent-row" key={session.id} style={{ alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <b>{session.game_name}{session.bazi_no != null ? ` — Bazi ${session.bazi_no}` : ` — ${session.market}`}</b>
            <small>{session.session_date} • Result {session.patti} - {session.single_digit} • {session.active_bets} active bet{session.active_bets === 1 ? "" : "s"} • Exposure ${session.exposure.toFixed(2)}</small>
          </div>
          <span className="admin-status active">RESULT DECLARED</span>
          <button className="admin-create-btn" type="button" onClick={() => void settleSelectedSession(session)} disabled={settlementLoading}>{settlementLoading ? "PROCESSING..." : "SETTLE"}</button>
        </div>
      ))}
    </div>
  )}
</section>
</>
 ) : adminModule === "REPORTS" ? (
<>
<section className="admin-panel-card">
  <div className="admin-panel-title-row">
    <div>
      <div className="admin-panel-title">BETTING REPORTS</div>
      <p className="admin-account-detail-intro" style={{ marginBottom: 0 }}>
        All individual customer betting entries. Latest bets are shown first.
      </p>
    </div>
    <button type="button" className="admin-small-action" onClick={() => void loadSuperAdminReports(reportsPage)} disabled={reportsLoading}>
      {reportsLoading ? "LOADING..." : "REFRESH REPORTS"}
    </button>
  </div>

  {reportsLoading ? <div className="admin-empty">LOADING BETTING REPORTS...</div> : reportsRows.length === 0 ? <div className="admin-empty">No betting entries found.</div> : (
    <>
      <div className="reports-table-scroll">
        <table className="reports-table">
          <thead>
            <tr>
              <th>DATE &amp; TIME</th><th>USERNAME</th><th>CUSTOMER SOURCE</th><th>AGENT</th><th>GAME</th><th>SESSION</th><th>BAZI</th><th>MARKET</th><th>BETTING TYPE</th><th>NUMBER / PATTI / JODI</th><th>AMOUNT</th><th>RATE</th><th>POTENTIAL WIN</th><th>RESULT</th><th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {reportsRows.map((row) => (
              <tr key={row.id}>
                <td>{row.bet_time ? new Date(row.bet_time).toLocaleString("en-IN") : "-"}</td>
                <td className="reports-strong">{row.username}</td>
                <td><span className={`reports-source reports-source-${row.customer_source === "Online Customer" ? "online" : "agent"}`}>{row.customer_source}</span></td>
                <td>{row.agent_username}</td>
                <td>{row.game_name}</td>
                <td>{row.session_code}</td>
                <td>{row.bazi_no == null ? "-" : row.bazi_no}</td>
                <td>{row.market}</td>
                <td>{row.bet_type}</td>
                <td className="reports-bet-value">{row.played_number}</td>
                <td>${row.stake.toFixed(2)}</td>
                <td>{row.rate.toFixed(2)}X</td>
                <td>${row.potential_win.toFixed(2)}</td>
                <td>{row.result}</td>
                <td><span className={`reports-status reports-status-${row.status.toLowerCase()}`}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-pagination">
        <button type="button" className="admin-small-action" disabled={reportsPage <= 0 || reportsLoading} onClick={() => void loadSuperAdminReports(reportsPage - 1)}>PREVIOUS</button>
        <span>PAGE {reportsPage + 1} OF {Math.max(1, Math.ceil(reportsTotal / 25))}{" • "}SHOWING {reportsRows.length} OF {reportsTotal}</span>
        <button type="button" className="admin-small-action" disabled={reportsLoading || (reportsPage + 1) * 25 >= reportsTotal} onClick={() => void loadSuperAdminReports(reportsPage + 1)}>NEXT</button>
      </div>
    </>
  )}
</section>
</>
  ) : adminModule === "AUDIT" ? (
<>
<section className="admin-panel-card audit-module-panel">
  <div className="admin-panel-title-row audit-title-row">
    <div>
      <div className="admin-panel-title">AUDIT</div>
      <p className="admin-account-detail-intro" style={{ marginBottom: 0 }}>
        Read-only financial and settlement history. Existing records are preserved.
      </p>
    </div>
    {auditView !== "HOME" ? (
      <button type="button" className="admin-small-action" onClick={() => { setAuditView("HOME"); setAdminError(""); }}>BACK</button>
    ) : null}
  </div>

  {auditView === "HOME" ? (
    <div className="audit-module-grid">
      <button type="button" className="audit-module-card" onClick={() => { setAuditView("TRANSACTION"); setAuditTransactionPage(0); setAdminError(""); void loadAuditTransactions(0); }}>
        <span className="audit-module-icon">↔</span>
        <span>
          <b>TRANSACTION</b>
          <small>Super Admin coin movement — given and received.</small>
        </span>
        <strong>›</strong>
      </button>
      <button type="button" className="audit-module-card" onClick={() => { setAuditView("SETTLEMENT"); setAuditSettlementPage(0); setAdminError(""); void loadAuditSettlements(0); }}>
        <span className="audit-module-icon">✓</span>
        <span>
          <b>SETTLEMENT</b>
          <small>Game settlement, result, network change and unburned balance.</small>
        </span>
        <strong>›</strong>
      </button>
    </div>
  ) : auditView === "TRANSACTION" ? (
    <div className="audit-detail-shell">
      <div className="audit-detail-header">
        <div>
          <b>TRANSACTION AUDIT</b>
          <small>Only Super Admin coin transfers. 25 entries per page.</small>
        </div>
        <button type="button" className="admin-small-action" onClick={() => void loadAuditTransactions(auditTransactionPage)} disabled={auditLoading}>
          {auditLoading ? "LOADING..." : "REFRESH"}
        </button>
      </div>

      {auditLoading ? <div className="audit-empty">LOADING TRANSACTION HISTORY...</div> : auditTransactionRows.length === 0 ? <div className="audit-empty">No transaction records found.</div> : (
        <>
          <div className="audit-white-scroll">
            <table className="audit-white-table audit-transaction-table">
              <thead><tr><th>DATE &amp; TIME</th><th>COUNTERPARTY</th><th>DIRECTION</th><th>AMOUNT</th><th>SUPER ADMIN AVAILABLE</th></tr></thead>
              <tbody>
                {auditTransactionRows.map((row) => (
                  <tr key={row.transaction_id}>
                    <td className="audit-date-time-cell">
                        {row.created_at ? (() => {
                          const dateTime = new Date(row.created_at);
                          return (
                            <>
                              <span>{dateTime.toLocaleDateString("en-IN")}</span>
                              <span>{dateTime.toLocaleTimeString("en-IN")}</span>
                            </>
                          );
                        })() : "-"}
                      </td>
                    <td>
                      <b className="audit-counterparty-name">{row.username || "-"}</b>
                      <span className={`audit-counterparty-type ${row.counterparty_type === "ONLINE CUSTOMER" ? "online" : "agent"}`}>{row.counterparty_type || "-"}</span>
                    </td>
                    <td><span className={`audit-direction ${row.direction === "RECEIVED" ? "received" : "given"}`}>{row.direction}</span></td>
                    <td className="audit-amount-cell">${row.amount.toFixed(2)}</td>
                    <td className="audit-after-cell">${row.super_admin_available_after.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="audit-pagination">
            <button type="button" className="audit-page-btn" disabled={auditTransactionPage <= 0 || auditLoading} onClick={() => void loadAuditTransactions(auditTransactionPage - 1)}>PREVIOUS</button>
            <span>PAGE {auditTransactionPage + 1} • SHOWING {auditTransactionRows.length}</span>
            <button type="button" className="audit-page-btn" disabled={!auditTransactionHasNext || auditLoading} onClick={() => void loadAuditTransactions(auditTransactionPage + 1)}>NEXT</button>
          </div>
        </>
      )}
    </div>
  ) : (
    <div className="audit-detail-shell">
      <div className="audit-detail-header">
        <div>
          <b>SETTLEMENT AUDIT</b>
          <small>Historical network position includes available balance and exposure. 25 entries per page.</small>
        </div>
        <button type="button" className="admin-small-action" onClick={() => void loadAuditSettlements(auditSettlementPage)} disabled={auditLoading}>
          {auditLoading ? "LOADING..." : "REFRESH"}
        </button>
      </div>

      {auditLoading ? <div className="audit-empty">LOADING SETTLEMENT HISTORY...</div> : auditSettlementRows.length === 0 ? <div className="audit-empty">No settlement records found.</div> : (
        <>
          <div className="audit-white-scroll">
            <table className="audit-white-table audit-settlement-table">
              <thead><tr><th>DATE &amp; TIME</th><th>GAME</th><th>BAZI</th><th>RESULT</th><th>SETTLEMENT / BET AMOUNT</th><th>NETWORK CHANGE</th><th>TOTAL NETWORK COINS</th></tr></thead>
              <tbody>
                {auditSettlementRows.map((row) => {
                  const positive = row.network_change > 0;
                  const negative = row.network_change < 0;
                  return (
                    <tr key={row.settlement_id}>
                      <td className="audit-date-time-cell">
                        {row.settled_at ? (() => {
                          const dateTime = new Date(row.settled_at);
                          return (
                            <>
                              <span>{dateTime.toLocaleDateString("en-IN")}</span>
                              <span>{dateTime.toLocaleTimeString("en-IN")}</span>
                            </>
                          );
                        })() : "-"}
                      </td>
                      <td className="audit-game-cell">{row.game_name}</td>
                      <td><span className="audit-bazi-badge">{row.bazi_label}</span></td>
                      <td className="audit-result-cell">{row.result_text}</td>
                      <td className="audit-amount-cell">${row.settlement_amount.toFixed(2)}</td>
                      <td className={positive ? "audit-network-positive" : negative ? "audit-network-negative" : "audit-network-neutral"}>
                        {positive ? "+" : negative ? "−" : ""}${Math.abs(row.network_change).toFixed(2)}
                      </td>
                      <td className="audit-after-cell">${row.network_unburned_available_after.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="audit-pagination">
            <button type="button" className="audit-page-btn" disabled={auditSettlementPage <= 0 || auditLoading} onClick={() => void loadAuditSettlements(auditSettlementPage - 1)}>PREVIOUS</button>
            <span>PAGE {auditSettlementPage + 1} • SHOWING {auditSettlementRows.length}</span>
            <button type="button" className="audit-page-btn" disabled={!auditSettlementHasNext || auditLoading} onClick={() => void loadAuditSettlements(auditSettlementPage + 1)}>NEXT</button>
          </div>
        </>
      )}
    </div>
  )}
</section>
</>
) : adminModule === "ACCOUNT_DIRECTORY" ? (<> {renderSuperAdminAccountDirectory()} </>
) : adminModule === "AGENT_WALLET" && agentWalletAction === null ? (
<>
<section className="admin-panel-card admin-wallet-lookup-card">
  <div className="admin-panel-title">AGENT WALLET</div>
  <p className="admin-account-detail-intro">
    Choose whether you want to deposit virtual USD to an Agent Admin or withdraw virtual USD back to Super Admin supply.
  </p>

  <div className="admin-module-grid">
    <button
      className="admin-module-card"
      type="button"
      onClick={() => {
        setAgentWalletAction("DEPOSIT");
        setAllocationAgentProfileId("");
        setAllocationAmount("");
        setAllocationNote("");
        setAdminError("");
      }}
    >
      <b>Deposit Virtual USD</b>
      <small>Send virtual USD to Agent</small>
    </button>

    <button
      className="admin-module-card"
      type="button"
      onClick={() => {
        setAgentWalletAction("WITHDRAW");
        setAllocationAgentProfileId("");
        setAllocationAmount("");
        setAllocationNote("");
        setAdminError("");
      }}
    >
      <b>Withdraw Virtual USD</b>
      <small>Return virtual USD from Agent</small>
    </button>
  </div>
</section>
</>
) : adminModule === "AGENT_WALLET" && agentWalletAction === "DEPOSIT" ? (
<>
<section className="admin-panel-card">
<div className="admin-panel-title">DEPOSIT VIRTUAL USD TO AGENT</div>
<div className="admin-form">
<div className="admin-form-field">
<label>AGENT ADMIN</label>
<select className="admin-form-input" value={allocationAgentProfileId} onChange={(e) => setAllocationAgentProfileId(e.target.value)} disabled={adminLoading}>
<option value="">Select Agent Admin</option>
{adminAgents.map((agent) => (
<option key={agent.id} value={agent.profile_id}>
{agent.username ? `${agent.username} — Balance $${Number(agent.available_balance || 0).toFixed(2)}` : `Balance $${Number(agent.available_balance || 0).toFixed(2)}`}
</option>
))}
</select>
</div>
<div className="admin-form-field">
<label>AMOUNT (USD)</label>
<input className="admin-form-input" type="number" min="0.01" step="0.01" inputMode="decimal" value={allocationAmount} onChange={(e) => setAllocationAmount(e.target.value)} placeholder="Enter amount" disabled={adminLoading}/>
</div>
<div className="admin-form-field">
<label>NOTE (OPTIONAL)</label>
<input className="admin-form-input" type="text" value={allocationNote} onChange={(e) => setAllocationNote(e.target.value)} placeholder="Deposit note" maxLength={200} disabled={adminLoading}/>
</div>
<div className="admin-form-note">This transfers virtual USD from the Super Admin supply to the selected Agent Admin wallet and records the movement in the virtual wallet ledger.</div>
<button className="admin-create-btn" type="button" onClick={allocateVirtualUsdToAgent} disabled={adminLoading}>
{adminLoading ? "PROCESSING..." : "DEPOSIT VIRTUAL USD"}
</button>
</div>
</section>
</>
) : adminModule === "AGENT_WALLET" && agentWalletAction === "WITHDRAW" ? (
<>
<section className="admin-panel-card">
<div className="admin-panel-title">WITHDRAW VIRTUAL USD FROM AGENT</div>
<div className="admin-form">
<div className="admin-form-field">
<label>AGENT ADMIN</label>
<select className="admin-form-input" value={allocationAgentProfileId} onChange={(e) => setAllocationAgentProfileId(e.target.value)} disabled={adminLoading}>
<option value="">Select Agent Admin</option>
{adminAgents.map((agent) => (
<option key={agent.id} value={agent.profile_id}>
{agent.username ? `${agent.username} — Balance $${Number(agent.available_balance || 0).toFixed(2)}` : `Balance $${Number(agent.available_balance || 0).toFixed(2)}`}
</option>
))}
</select>
</div>
<div className="admin-form-field">
<label>AMOUNT (USD)</label>
<input className="admin-form-input" type="number" min="0.01" step="0.01" inputMode="decimal" value={allocationAmount} onChange={(e) => setAllocationAmount(e.target.value)} placeholder="Enter amount" disabled={adminLoading}/>
</div>
<div className="admin-form-field">
<label>NOTE (OPTIONAL)</label>
<input className="admin-form-input" type="text" value={allocationNote} onChange={(e) => setAllocationNote(e.target.value)} placeholder="Withdrawal note" maxLength={200} disabled={adminLoading}/>
</div>
<div className="admin-form-note">This returns virtual USD from the selected Agent Admin wallet to the Super Admin supply through the secure wallet transfer RPC.</div>
<button className="admin-create-btn" type="button" onClick={withdrawVirtualUsdFromAgent} disabled={adminLoading}>
WITHDRAW VIRTUAL USD
</button>
</div>
</section>
</>
) : adminModule === "ONLINE_CUSTOMER" ? (
<>
<section className="admin-panel-card">
  <div className="admin-panel-title">ONLINE CUSTOMER WALLET CONTROL</div>
  <p className="admin-account-detail-intro">
    Only customers created online and not assigned to an Agent are available here.
  </p>

  <div className="admin-form">
    <div className="admin-form-field">
      <label>ONLINE CUSTOMER</label>
      <select
        className="admin-form-input"
        value={onlineCoinCustomerId}
        onChange={(e) => setOnlineCoinCustomerId(e.target.value)}
        disabled={adminLoading}
      >
        <option value="">Select Online Customer</option>
        {onlineCustomers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.username || customer.customer_code} — Balance ${customer.available_balance.toFixed(2)}
          </option>
        ))}
      </select>
    </div>

    <div className="admin-form-field">
      <label>AMOUNT (USD)</label>
      <input
        className="admin-form-input"
        type="number"
        min="0.01"
        step="0.01"
        inputMode="decimal"
        value={onlineCoinAmount}
        onChange={(e) => setOnlineCoinAmount(e.target.value)}
        placeholder="Enter amount"
        disabled={adminLoading}
      />
    </div>

    <div className="admin-form-note">
      Super Admin can transfer virtual USD only with ONLINE customers. Agent-assigned customers are not available in this module.
    </div>

    <div className="admin-form-actions">
      <button
        className="admin-create-btn"
        type="button"
        onClick={() => transferSuperAdminOnlineCustomer("SUPER_ADMIN_TO_CUSTOMER")}
        disabled={adminLoading || onlineCustomers.length === 0}
      >
        {adminLoading ? "PROCESSING..." : "DEPOSIT VIRTUAL USD"}
      </button>

      <button
        className="admin-create-btn"
        type="button"
        onClick={() => transferSuperAdminOnlineCustomer("CUSTOMER_TO_SUPER_ADMIN")}
        disabled={adminLoading || onlineCustomers.length === 0}
      >
        {adminLoading ? "PROCESSING..." : "WITHDRAW VIRTUAL USD"}
      </button>
    </div>
  </div>
</section>
</>
) : adminModule === "ACCOUNT_OVERVIEW" ? (
<>
<section className="admin-panel-card admin-account-detail-panel">
  <div className="admin-section-kicker">ACCOUNT MANAGEMENT</div>
  <div className="admin-panel-title">VIRTUAL USD SUPPLY & ACCOUNT OVERVIEW</div>
  <p className="admin-account-detail-intro">Current supply, network balances and customer exposure overview.</p>

  <div className="admin-account-grid admin-account-grid-detail">
    <div className="admin-account-card primary"><span>SUPER ADMIN AVAILABLE</span><strong className="admin-available-value">${adminAccountStats.superAdminAvailable.toFixed(2)}</strong><small>Current main supply available to Super Admin</small></div>
    <div className="admin-account-card"><span>DISTRIBUTED TO NETWORK</span><strong>${adminAccountStats.distributed.toFixed(2)}</strong><small>Current unburned supply held by the network</small></div>
    <div className="admin-account-card"><span>AGENT AVAILABLE</span><strong className="admin-available-value">${adminAccountStats.agentAvailable.toFixed(2)}</strong><small>Agent wallet balances</small></div>
    <div className="admin-account-card"><span>CUSTOMER AVAILABLE</span><strong className="admin-available-value">${adminAccountStats.customerAvailable.toFixed(2)}</strong><small>Active customer wallet balances</small></div>
    <div className="admin-account-card"><span>CUSTOMER EXPOSURE</span><strong className="admin-exposure-value">${adminAccountStats.customerExposure.toFixed(2)}</strong><small>All Agent Customer + Online Customer exposure</small></div>
    <div className="admin-account-card highlight"><span>SUPPLY CHANGE</span><strong>{adminAccountStats.supplyChange == null ? "VERIFY" : `${adminAccountStats.supplyChange >= 0 ? "+" : ""}$${adminAccountStats.supplyChange.toFixed(2)}`}</strong><small>Net betting-generated supply change</small></div>
  </div>

</section>
</>
) : (
<section className="admin-panel-card">

<div className="admin-panel-title">
CREATE AGENT ADMIN
</div>

<div className="admin-form">

<div className="admin-form-field">
<label>USERNAME</label>
<input
className="admin-form-input"
type="text"
value={agentUsername}
onChange={(e) => setAgentUsername(e.target.value.toLowerCase())}
placeholder="Enter username"
autoComplete="off"
maxLength={50}
/>
</div>

<div className="admin-form-field">
<label>FULL NAME</label>
<input
className="admin-form-input"
type="text"
value={agentFullName}
onChange={(e) => setAgentFullName(e.target.value)}
placeholder="Enter full name"
autoComplete="name"
/>
</div>

<div className="admin-form-field">
<label>EMAIL (OPTIONAL)</label>
<input
className="admin-form-input"
type="email"
value={agentEmail}
onChange={(e) => setAgentEmail(e.target.value)}
placeholder="agent@example.com"
autoComplete="off"
/>
</div>

<div className="admin-form-field">
<label>PASSWORD</label>
<input
className="admin-form-input"
type="password"
value={agentPassword}
onChange={(e) => setAgentPassword(e.target.value)}
placeholder="Minimum 8 characters"
autoComplete="new-password"
/>
</div>

<div className="admin-form-field">
<label>CONFIRM PASSWORD</label>
<input
className="admin-form-input"
type="password"
value={agentConfirmPassword}
onChange={(e) => setAgentConfirmPassword(e.target.value)}
placeholder="Re-enter password"
autoComplete="new-password"
/>
</div>

<div className="admin-form-note">
Agent Admin account will be created with an ACTIVE status.
</div>

<button
className="admin-create-btn"
type="button"
onClick={() => {
  setAdminError("");
  setAdminSuccess("");

  const normalizedAgentUsername = agentUsername.trim().toLowerCase();

  if (!normalizedAgentUsername) {
    setAdminError("Username is required.");
    return;
  }

  if (normalizedAgentUsername.length < 3 || normalizedAgentUsername.length > 50 || !/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(normalizedAgentUsername)) {
    setAdminError("Username must be 3–50 characters and use only lowercase letters, numbers, dot, underscore or hyphen; it cannot start or end with a special character.");
    return;
  }

  if (agentFullName.trim().length > 100) {
    setAdminError("Full name must be 100 characters or less.");
    return;
  }

  if (agentEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agentEmail.trim())) {
    setAdminError("Please enter a valid email address.");
    return;
  }

  if (agentPassword.length < 8) {
    setAdminError("Password must be at least 8 characters.");
    return;
  }

  if (agentPassword !== agentConfirmPassword) {
    setAdminError("Passwords do not match.");
    return;
  }

  setAdminLoading(true);

  getFreshAgentAdminAccessToken().then((accessToken) => {
    return supabase.functions.invoke("create-agent-admin", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: {
        username: normalizedAgentUsername,
        full_name: agentFullName.trim(),
        email: agentEmail.trim() ? agentEmail.trim().toLowerCase() : null,
        password: agentPassword
      }
    });
  }).then(({ data, error }) => {
    if (error) throw error;
    if (!data?.success) {
      throw new Error(data?.error || "Unable to create Agent Admin.");
    }

    setAgentUsername("");
    setAgentFullName("");
    setAgentEmail("");
    setAgentPassword("");
    setAgentConfirmPassword("");
    const createdAgent = data?.agent;
    if (createdAgent?.id) {
      setAdminAgents((current) => [
        {
          id: createdAgent.id,
          agent_code: createdAgent.agent_code,
          profile_id: createdAgent.profile_id,
          status: createdAgent.status,
          username: createdAgent.username || "",
          available_balance: 0,
          exposure_balance: 0,
          wallet_status: "ACTIVE",
        },
        ...current.filter((agent) => agent.id !== createdAgent.id),
      ].slice(0, 20));
    }
    setAdminStats((current) => ({
      ...current,
      agents: current.agents + 1,
    }));
    setAdminSuccess(`Agent Admin created successfully. Agent Code: ${createdAgent?.agent_code || "N/A"}`);
    setAdminModule("HOME");
  }).catch(async (error) => {
    let message = error instanceof Error ? error.message : "Unable to create Agent Admin.";

    try {
      const response = error?.context;
      if (response && typeof response.json === "function") {
        const body = await response.json().catch(() => null);
        message = body?.error || body?.message || message;
      }
    } catch (_) {
      // Keep the original error message if the Edge Function response cannot be read.
    }

    setAdminError(message);
  }).finally(() => {
    setAdminLoading(false);
  });
}}
>
{adminLoading ? "CREATING..." : "CREATE AGENT ADMIN"}
</button>

</div>
</section>
)}

</main>
</div>
);


const renderForcedPasswordReset = () => (
<div className="admin-shell">
  <header className="admin-header"><div><div className="admin-brand">APNA MATKA</div><div className="admin-subtitle">SECURITY CHECK</div></div><div className="admin-header-actions"><span className="admin-role-badge">PASSWORD UPDATE</span></div></header>
  <main className="admin-main">
    <section className="admin-welcome-card"><div><div className="admin-section-kicker">FIRST LOGIN</div><h1>Update Your Password</h1><p>Your administrator-created account requires a password update before you can continue.</p></div></section>
    <section className="admin-panel-card">
      <div className="admin-panel-title">UPDATE PASSWORD</div>
      <div className="admin-form">
        <div className="admin-form-field"><label>CURRENT PASSWORD</label><input className="admin-form-input" type="password" value={passwordResetCurrent} onChange={(e)=>setPasswordResetCurrent(e.target.value)} maxLength={16} autoComplete="current-password" /></div>
        <div className="admin-form-field"><label>NEW PASSWORD</label><input className="admin-form-input" type="password" value={passwordResetNew} onChange={(e)=>setPasswordResetNew(e.target.value)} maxLength={16} autoComplete="new-password" /></div>
        <div className="admin-form-field"><label>REPEAT NEW PASSWORD</label><input className="admin-form-input" type="password" value={passwordResetConfirm} onChange={(e)=>setPasswordResetConfirm(e.target.value)} maxLength={16} autoComplete="new-password" /></div>
        <div className="admin-form-note">New password must be 8–16 characters and must match both new-password fields.</div>
        {passwordResetError ? <div className="admin-error">{passwordResetError}</div> : null}
        {passwordResetSuccess ? <div className="admin-success">{passwordResetSuccess}</div> : null}
        <button className="admin-create-btn" type="button" onClick={()=>void verifyCurrentPasswordAndUpdate(true)} disabled={passwordResetLoading}>{passwordResetLoading ? "UPDATING..." : "UPDATE PASSWORD"}</button>
        <button className="admin-small-action" type="button" onClick={logoutCustomer} disabled={passwordResetLoading}>LOGOUT</button>
      </div>
    </section>
  </main>
</div>
);

const renderAgentAdminArea = () => {
  const customerPageCount = Math.max(1, Math.ceil(agentCustomerSearchTotal / 25));
  const currentCustomerPage = Math.min(agentAllCustomerPage, customerPageCount);

  const openAgentModule = (module: typeof agentDashboardModule) => {
    setAgentDashboardModule(module);
    setAgentCustomerError("");
    setAgentCustomerSuccess("");
    if (module === "CUSTOMERS") {
      setAgentAllCustomerSearch("");
      setAgentAllCustomerPage(1);
      void loadAgentAllCustomerAccounts(1, "");
    }
    if (module === "ACCOUNT_OVERVIEW") {
      void loadAgentAccountOverview();
    }
    if (module === "BET_HISTORY") {
      setAgentReportsPage(0);
      void loadAgentBetHistory(0);
    }
    if (module === "EXPOSURE") {
      void loadAgentAccountOverview();
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <div className="admin-brand">APNA MATKA</div>
          <div className="admin-subtitle">AGENT ADMIN CONTROL PANEL</div>
        </div>
        <div className="admin-header-actions">
          <span className="admin-role-badge">AGENT ADMIN</span>
          <button className="admin-logout-btn" onClick={logoutCustomer}>LOGOUT</button>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-welcome-card">
          <div>
            <div className="admin-section-kicker">AGENT CONTROL CENTER</div>
            <h1>Agent Admin Dashboard</h1>
            <p>Manage your customers, virtual USD balances, exposure and betting activity.</p>
          </div>
          <button
            className="admin-refresh-btn"
            type="button"
            onClick={() => {
              if (agentDashboardModule === "BET_HISTORY") {
                void loadAgentBetHistory(agentReportsPage);
              } else if (agentDashboardModule === "CUSTOMERS") {
                void loadAgentAllCustomerAccounts(currentCustomerPage, agentAllCustomerSearch);
              } else {
                void loadAgentCustomerPage(agentCustomerPage);
              }
            }}
            disabled={agentCustomerLoading || agentAllCustomerLoading || agentReportsLoading}
          >
            {agentCustomerLoading || agentAllCustomerLoading || agentReportsLoading ? "LOADING..." : "REFRESH"}
          </button>
        </section>

        {agentCustomerSuccess ? <div className="admin-success">{agentCustomerSuccess}</div> : null}
        {agentCustomerError ? <div className="admin-error">{agentCustomerError}</div> : null}

        {agentDashboardModule === "HOME" ? (
          <>
            <section className="admin-stat-grid">
              <div className="admin-stat-card"><span>TOTAL CUSTOMERS</span><strong>{agentOverviewStats.customers}</strong></div>
              <div className="admin-stat-card"><span>AGENT AVAILABLE BALANCE</span><strong className="admin-available-value">${agentOverviewStats.agentAvailable.toFixed(2)}</strong></div>
              <div className="admin-stat-card"><span>CUSTOMER AVAILABLE BALANCE</span><strong className="admin-available-value">${agentOverviewStats.customerAvailable.toFixed(2)}</strong></div>
              <div className="admin-stat-card"><span>CUSTOMER EXPOSURE</span><strong className="admin-exposure-value">${agentOverviewStats.customerExposure.toFixed(2)}</strong></div>
            </section>

            <section className="admin-module-grid admin-home-modules">
              <button className="admin-module-card" type="button" onClick={() => openAgentModule("ACCOUNT_OVERVIEW")}>
                <b>Account Overview</b><small>Agent balance, customer balance & exposure</small>
              </button>
              <button className="admin-module-card" type="button" onClick={() => openAgentModule("CUSTOMERS")}>
                <b>Customer Accounts</b><small>View only your customers, search & manage accounts</small>
              </button>
              <button className="admin-module-card" type="button" onClick={() => openAgentModule("CREATE_CUSTOMER")}>
                <b>Create Customer</b><small>Create a new customer under this Agent</small>
              </button>
              <button className="admin-module-card" type="button" onClick={() => { setAgentDashboardModule("DEPOSIT_WITHDRAW"); setAgentCoinModule("OVERVIEW"); setAgentCustomerError(""); setAgentCustomerSuccess(""); }}>
                <b>Deposit / Withdrawal</b><small>Deposit to Customer or withdraw from Customer</small>
              </button>
              <button className="admin-module-card" type="button" onClick={() => openAgentModule("BET_HISTORY")}>
                <b>Bet History</b><small>Only your customers' betting activity — 25 per page</small>
              </button>
              <button className="admin-module-card" type="button" onClick={() => openAgentModule("EXPOSURE")}>
                <b>Exposure</b><small>Customer exposure and available balance details</small>
              </button>
              <button className="admin-module-card" type="button" onClick={() => { setAgentDashboardModule("PASSWORD_RESET"); setAgentCoinModule("OVERVIEW"); setAdminPasswordResetTarget(""); setAdminPasswordResetPassword(""); setAgentCustomerError(""); setAgentCustomerSuccess(""); }}>
                <b>Password Reset</b><small>Own password change or Customer password reset</small>
              </button>
            </section>
          </>
        ) : agentDashboardModule === "ACCOUNT_OVERVIEW" ? (
          <section className="admin-panel-card">
            <div className="admin-panel-title-row">
              <div className="admin-panel-title">ACCOUNT OVERVIEW</div>
              <button className="admin-small-action" type="button" onClick={() => setAgentDashboardModule("HOME")}>BACK</button>
            </div>
            <div className="admin-stat-grid">
              <div className="admin-stat-card"><span>AGENT AVAILABLE BALANCE</span><strong className="admin-available-value">${agentOverviewStats.agentAvailable.toFixed(2)}</strong></div>
              <div className="admin-stat-card"><span>CUSTOMER AVAILABLE BALANCE</span><strong className="admin-available-value">${agentOverviewStats.customerAvailable.toFixed(2)}</strong></div>
              <div className="admin-stat-card"><span>CUSTOMER EXPOSURE BALANCE</span><strong className="admin-exposure-value">${agentOverviewStats.customerExposure.toFixed(2)}</strong></div>
              <div className="admin-stat-card"><span>TOTAL CUSTOMERS</span><strong>{agentOverviewStats.customers}</strong></div>
            </div>
          </section>
        ) : agentDashboardModule === "CUSTOMERS" ? (
          <section className="admin-panel-card">
            <div className="admin-panel-title-row">
              <div>
                <div className="admin-section-kicker">CUSTOMER MANAGEMENT</div>
                <div className="admin-panel-title">CUSTOMER ACCOUNTS</div>
              </div>
              <button className="admin-small-action" type="button" onClick={() => setAgentDashboardModule("HOME")}>BACK</button>
            </div>

            <div className="admin-wallet-lookup-row" style={{ marginBottom: "12px" }}>
              <input
                className="admin-form-input"
                type="text"
                value={agentAllCustomerSearch}
                onChange={(e) => setAgentAllCustomerSearch(e.target.value.toLowerCase())}
                onKeyDown={(e) => { if (e.key === "Enter") { setAgentAllCustomerPage(1); void loadAgentAllCustomerAccounts(1, agentAllCustomerSearch); } }}
                placeholder="Search your customer username..."
                maxLength={50}
              />
              <button
                type="button"
                className="admin-small-action"
                onClick={() => { setAgentAllCustomerPage(1); void loadAgentAllCustomerAccounts(1, agentAllCustomerSearch); }}
                disabled={agentAllCustomerLoading}
              >
                {agentAllCustomerLoading ? "SEARCHING..." : "SEARCH"}
              </button>
            </div>

            {agentAllCustomerLoading ? <div className="admin-empty">LOADING CUSTOMER ACCOUNTS...</div> : agentAllCustomers.length === 0 ? <div className="admin-empty">No customer accounts found.</div> : (
              <>
                <div className="admin-agent-list">
                  {agentAllCustomers.map((c) => (
                    <div className="admin-agent-row" key={c.id} style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: "170px" }}>
                        <b>{c.username || c.customer_code}</b>
                        <small>{c.full_name || "Name not available"} • {c.customer_code}</small>
                        <small>Available $ {c.available_balance.toFixed(2)} • Exposure $ {c.exposure_balance.toFixed(2)}</small>
                      </div>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <span className={`admin-status ${c.status === "ACTIVE" ? "active" : ""}`}>{c.status === "BLOCKED" ? "PAUSED" : c.status}</span>
                        <button type="button" className="admin-small-action" onClick={() => setSelectedAgentCustomer(c)}>VIEW</button>
                        <button type="button" className="admin-small-action" onClick={() => void setAgentCustomerAccountStatus(c)} disabled={agentAllCustomerLoading}>{c.status === "BLOCKED" ? "RESUME CUSTOMER" : "PAUSE CUSTOMER"}</button>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedAgentCustomer ? (
                  <div className="admin-wallet-result-row" style={{ marginTop: "10px" }}>
                    <div><b>{selectedAgentCustomer.username}</b><small>{selectedAgentCustomer.customer_code} • {selectedAgentCustomer.email || "Email not available"}</small></div>
                    <div className="admin-wallet-result-balances">
                      <span>Available <strong className="admin-available-value">${Number(selectedAgentCustomer.available_balance || 0).toFixed(2)}</strong></span>
                      <span>Exposure <strong className="admin-exposure-value">${Number(selectedAgentCustomer.exposure_balance || 0).toFixed(2)}</strong></span>
                      <span>Status <strong>{selectedAgentCustomer.status === "BLOCKED" ? "PAUSED" : selectedAgentCustomer.status}</strong></span>
                    </div>
                  </div>
                ) : null}
                {customerPageCount > 1 ? (
                  <div className="admin-pagination">
                    <button className="admin-small-action" disabled={currentCustomerPage <= 1 || agentAllCustomerLoading} onClick={() => void loadAgentAllCustomerAccounts(currentCustomerPage - 1, agentAllCustomerSearch)}>PREVIOUS</button>
                    <span>PAGE {currentCustomerPage} / {customerPageCount}</span>
                    <button className="admin-small-action" disabled={currentCustomerPage >= customerPageCount || agentAllCustomerLoading} onClick={() => void loadAgentAllCustomerAccounts(currentCustomerPage + 1, agentAllCustomerSearch)}>NEXT</button>
                  </div>
                ) : null}
              </>
            )}
          </section>
        ) : agentDashboardModule === "CREATE_CUSTOMER" ? (
          <section className="admin-panel-card">
            <div className="admin-panel-title-row">
              <div><div className="admin-section-kicker">CUSTOMER MANAGEMENT</div><div className="admin-panel-title">CREATE CUSTOMER</div></div>
              <button className="admin-small-action" type="button" onClick={() => setAgentDashboardModule("HOME")}>BACK</button>
            </div>
            <div className="admin-form">
              <div className="admin-form-field"><label>USERNAME</label><input className="admin-form-input" type="text" value={agentCustomerUsername} onChange={(e) => setAgentCustomerUsername(e.target.value.toLowerCase())} placeholder="Enter username" maxLength={50} /></div>
              <div className="admin-form-field"><label>FULL NAME (OPTIONAL)</label><input className="admin-form-input" type="text" value={agentCustomerFullName} onChange={(e) => setAgentCustomerFullName(e.target.value)} placeholder="Enter full name" /></div>
              <div className="admin-form-field"><label>EMAIL (OPTIONAL)</label><input className="admin-form-input" type="email" value={agentCustomerEmail} onChange={(e) => setAgentCustomerEmail(e.target.value)} placeholder="customer@example.com" /></div>
              <div className="admin-form-field"><label>PASSWORD</label><input className="admin-form-input" type="password" value={agentCustomerPassword} onChange={(e) => setAgentCustomerPassword(e.target.value)} placeholder="8–16 characters" maxLength={16} /></div>
              <div className="admin-form-field"><label>CONFIRM PASSWORD</label><input className="admin-form-input" type="password" value={agentCustomerConfirmPassword} onChange={(e) => setAgentCustomerConfirmPassword(e.target.value)} placeholder="Re-enter password" maxLength={16} /></div>
              <div className="admin-form-note">Customer will be created under this Agent Admin. Email is optional; username and password are required.</div>
              <button className="admin-create-btn" type="button" onClick={createAgentCustomer} disabled={agentCustomerLoading}>{agentCustomerLoading ? "CREATING..." : "CREATE CUSTOMER"}</button>
            </div>
          </section>
        ) : agentDashboardModule === "DEPOSIT_WITHDRAW" ? (
          <section className="admin-panel-card">
            <div className="admin-panel-title-row">
              <div><div className="admin-section-kicker">CUSTOMER WALLET CONTROL</div><div className="admin-panel-title">DEPOSIT / WITHDRAWAL</div></div>
              <button className="admin-small-action" type="button" onClick={() => { setAgentDashboardModule("HOME"); setAgentCoinModule("OVERVIEW"); }}>BACK</button>
            </div>
            {agentCoinModule === "OVERVIEW" ? (
              <div className="admin-module-grid">
                <button className="admin-module-card" type="button" onClick={() => setAgentCoinModule("DEPOSIT_CUSTOMER")}><b>Deposit</b><small>Send virtual USD from Agent to Customer</small></button>
                <button className="admin-module-card" type="button" onClick={() => setAgentCoinModule("WITHDRAW_CUSTOMER")}><b>Withdrawal</b><small>Return virtual USD from Customer to Agent</small></button>
              </div>
            ) : renderAgentCustomerCoinModule()}
          </section>
        ) : agentDashboardModule === "BET_HISTORY" ? (
          <section className="admin-panel-card">
            <div className="admin-panel-title-row">
              <div><div className="admin-section-kicker">BETTING REPORT</div><div className="admin-panel-title">BET HISTORY</div></div>
              <button className="admin-small-action" type="button" onClick={() => setAgentDashboardModule("HOME")}>BACK</button>
            </div>
            <div style={{ overflowX: "auto", width: "100%" }}>
              {agentReportsLoading ? <div className="admin-empty">LOADING BET HISTORY...</div> : agentReportsRows.length === 0 ? <div className="admin-empty">No betting entries found.</div> : (
                <table className="admin-report-table" style={{ minWidth: "1100px", width: "100%" }}>
                  <thead><tr><th>TIME</th><th>USERNAME</th><th>GAME</th><th>SESSION</th><th>BAZI</th><th>MARKET</th><th>BET TYPE</th><th>NUMBER</th><th>STAKE</th><th>RATE</th><th>POTENTIAL WIN</th><th>RESULT</th><th>STATUS</th></tr></thead>
                  <tbody>{agentReportsRows.map((row) => <tr key={row.id}><td>{row.bet_time ? new Date(row.bet_time).toLocaleString() : "-"}</td><td>{row.username}</td><td>{row.game_name}</td><td>{row.session_code}</td><td>{row.bazi_no ?? "-"}</td><td>{row.market}</td><td>{row.bet_type}</td><td>{row.played_number}</td><td>${row.stake.toFixed(2)}</td><td>{row.rate}X</td><td>${row.potential_win.toFixed(2)}</td><td>{row.result}</td><td>{row.status}</td></tr>)}</tbody>
                </table>
              )}
            </div>
            {agentReportsTotal > 0 ? <div className="admin-pagination"><button className="admin-small-action" disabled={agentReportsPage <= 0 || agentReportsLoading} onClick={() => void loadAgentBetHistory(agentReportsPage - 1)}>PREVIOUS</button><span>PAGE {agentReportsPage + 1} OF {Math.max(1, Math.ceil(agentReportsTotal / 25))} • SHOWING {agentReportsRows.length} OF {agentReportsTotal}</span><button className="admin-small-action" disabled={agentReportsLoading || (agentReportsPage + 1) * 25 >= agentReportsTotal} onClick={() => void loadAgentBetHistory(agentReportsPage + 1)}>NEXT</button></div> : null}
          </section>
        ) : agentDashboardModule === "EXPOSURE" ? (
          <section className="admin-panel-card">
            <div className="admin-panel-title-row">
              <div><div className="admin-section-kicker">CUSTOMER RISK VIEW</div><div className="admin-panel-title">CUSTOMER EXPOSURE</div></div>
              <button className="admin-small-action" type="button" onClick={() => setAgentDashboardModule("HOME")}>BACK</button>
            </div>
            <div className="admin-stat-grid">
              <div className="admin-stat-card"><span>TOTAL CUSTOMER EXPOSURE</span><strong className="admin-exposure-value">${agentOverviewStats.customerExposure.toFixed(2)}</strong></div>
              <div className="admin-stat-card"><span>TOTAL CUSTOMER AVAILABLE</span><strong className="admin-available-value">${agentOverviewStats.customerAvailable.toFixed(2)}</strong></div>
            </div>
            {agentExposureRows.length === 0 ? <div className="admin-empty">No customer accounts found.</div> : <div className="admin-agent-list">{agentExposureRows.map((row) => <div className="admin-agent-row" key={row.id}><div style={{ flex: 1 }}><b>{row.username}</b><small>{row.customer_code}</small></div><div className="admin-wallet-result-balances"><span>Available <strong className="admin-available-value">${row.available_balance.toFixed(2)}</strong></span><span>Exposure <strong className="admin-exposure-value">${row.exposure_balance.toFixed(2)}</strong></span><span>Status <strong>{row.status === "BLOCKED" ? "PAUSED" : row.status}</strong></span></div></div>)}</div>}
          </section>
        ) : (
          <section className="admin-panel-card">
            <div className="admin-panel-title-row">
              <div><div className="admin-section-kicker">ACCOUNT SECURITY</div><div className="admin-panel-title">PASSWORD RESET</div></div>
              <button className="admin-small-action" type="button" onClick={() => setAgentDashboardModule("HOME")}>BACK</button>
            </div>
            {agentCoinModule === "OVERVIEW" ? (
              <div className="admin-module-grid">
                <button className="admin-module-card" type="button" onClick={() => setAgentCoinModule("CHANGE_PASSWORD")}><b>Own Password</b><small>Change your Agent Admin password</small></button>
                <button className="admin-module-card" type="button" onClick={() => { setAgentCoinModule("PASSWORD_RESET"); setAdminPasswordResetTarget(""); setAdminPasswordResetPassword(""); }}><b>Customer Password Reset</b><small>Select your Customer and set a new password</small></button>
              </div>
            ) : agentCoinModule === "CHANGE_PASSWORD" ? (
              <div className="admin-form">
                <div className="admin-panel-title-row"><div className="admin-panel-title">OWN PASSWORD CHANGE</div><button className="admin-small-action" type="button" onClick={() => setAgentCoinModule("OVERVIEW")}>BACK</button></div>
                <div className="admin-form-field"><label>CURRENT PASSWORD</label><input className="admin-form-input" type="password" value={passwordResetCurrent} onChange={(e)=>setPasswordResetCurrent(e.target.value)} maxLength={16} /></div>
                <div className="admin-form-field"><label>NEW PASSWORD</label><input className="admin-form-input" type="password" value={passwordResetNew} onChange={(e)=>setPasswordResetNew(e.target.value)} maxLength={16} /></div>
                <div className="admin-form-field"><label>REPEAT NEW PASSWORD</label><input className="admin-form-input" type="password" value={passwordResetConfirm} onChange={(e)=>setPasswordResetConfirm(e.target.value)} maxLength={16} /></div>
                {passwordResetError ? <div className="admin-error">{passwordResetError}</div> : null}
                {passwordResetSuccess ? <div className="admin-success">{passwordResetSuccess}</div> : null}
                <button className="admin-create-btn" type="button" onClick={()=>void verifyCurrentPasswordAndUpdate(false)} disabled={passwordResetLoading}>{passwordResetLoading ? "UPDATING..." : "UPDATE PASSWORD"}</button>
              </div>
            ) : (
              <div className="admin-form">
                <div className="admin-panel-title-row"><div className="admin-panel-title">CUSTOMER PASSWORD RESET</div><button className="admin-small-action" type="button" onClick={() => setAgentCoinModule("OVERVIEW")}>BACK</button></div>
                <div className="admin-form-field"><label>CUSTOMER</label><select className="admin-form-input" value={adminPasswordResetTarget} onChange={(e)=>setAdminPasswordResetTarget(e.target.value)}><option value="">Select Customer</option>{agentAllCustomers.filter(c=>c.status==="ACTIVE").map(c=><option key={c.profile_id} value={c.profile_id}>{c.username} — {c.customer_code}</option>)}</select></div>
                <div className="admin-form-field"><label>NEW PASSWORD</label><input className="admin-form-input" type="password" value={adminPasswordResetPassword} onChange={(e)=>setAdminPasswordResetPassword(e.target.value)} maxLength={16} placeholder="8–16 characters" autoComplete="new-password" /></div>
                <div className="admin-form-note">Set a new 8–16 character password for the selected Customer. The Customer will be required to change it at next login.</div>
                <button className="admin-create-btn" type="button" onClick={()=>void resetAgentCustomerPassword()} disabled={agentAllCustomerLoading}>{agentAllCustomerLoading ? "RESETTING..." : "RESET PASSWORD"}</button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

const renderCustomerArea = () => {


if (customerPage === "betting") {


return renderBettingPage();


}




if (customerPage === "history") {


return renderHistoryPage();


}




if (customerPage === "result") {


return renderResultPage();


}


if (customerPage === "profile") {


return renderProfilePage();


}




if (customerPage === "statement") {


return renderStatementPage();


}




return renderCustomerHome();

};




/* =========================================================


MAIN APP


========================================================= */




return (


<div className="app">


<style>{`


     *{


     box-sizing: border-box;


}




html {


scroll-behavior: smooth;


}




body {

margin: 0;


padding: 0;


font-family: Arial, Helvetica, sans-serif;


background: #05070a;


color: #fff;


}




button,


input {


font-family: inherit;


}




button {


-webkit-tap-highlight-color: transparent;


}




.app {


min-height: 100vh;


width: 100%;

overflow-x: hidden;


background:


    radial-gradient(


    circle at 50% -20%,


    rgba(255,190,0,.08),


    transparent 30%


    ),


    linear-gradient(


    180deg,


    #06080d 0%,


    #080b11 55%,


    #030405 100%


    );


}




/* ================= HEADER ================= */




.header,

.customer-header {


width: 100%;


padding: 12px;


background:


    linear-gradient(


    180deg,


    #0c1017,


    #080b10


    );


border-bottom:


    1px solid


    rgba(255,195,0,.25);


}


.header-inner,


.customer-header-inner {


width: 100%;


max-width: 520px;


margin: 0 auto;


}

.brand-row,


.customer-header-inner {


display: flex;


align-items: center;


justify-content: space-between;


gap: 8px;


}




.brand {


color: #ffc928;


font-size: 20px;


font-weight: 900;


letter-spacing: 1px;


}




.brand-subtitle,


.customer-subtitle {

margin-top: 3px;


color: #777;


font-size: 7px;


}


.auth-buttons {


display: flex;


gap: 6px;


}




.auth-btn {


min-width: 48px;


height: 30px;


padding: 0 9px;


border-radius: 7px;


border: 1px solid


    rgba(255,195,0,.5);


background: #10141b;


color: #ffd33c;


font-size: 8px;

font-weight: 900;


cursor: pointer;


}




.auth-btn.signup {


background:


    linear-gradient(


    135deg,


    #ffe46b,


    #ffbd19


    );


color: #111;


}


.support-row {


display: flex;


gap: 6px;


margin-top: 8px;


}

.support-btn {


flex: 1;


height: 27px;


display: flex;


align-items: center;


justify-content: center;


border-radius: 6px;


text-decoration: none;


color: #ddd;


background: #11151d;


border: 1px solid #252d38;


font-size: 8px;


font-weight: 700;


}




.welcome {


width: 100%;


max-width: 520px;

margin: 0 auto;


padding: 17px 12px 9px;


}




.welcome h1 {


margin: 0;


font-size: 17px;


font-weight: 900;


}




.welcome p {


margin: 5px 0 0;


color: #858990;


font-size: 8px;


line-height: 1.5;


}




.today-title,

.customer-section-title {


margin-top: 15px;


color: #e9bd29;


font-size: 9px;


font-weight: 900;


letter-spacing: .8px;


}




.games {


width: 100%;


max-width: 520px;


margin: 0 auto;


padding: 0 10px 18px;


}




.game-card,


.customer-game-card,


.betting-card {


margin-bottom: 10px;

padding: 10px;


border-radius: 12px;


background:


    linear-gradient(


    145deg,


    #10151d,


    #0a0e14


    );


border: 1px solid #222b37;


}




.game-head,


.customer-game-header {


display: flex;


align-items: center;


justify-content: space-between;


gap: 8px;


margin-bottom: 8px;

}




.game-title,


.customer-game-title {


color: #f2cf57;


font-size: 15px;


font-weight: 900;


}


.customer-game-title.kolkata-title {


color: #e7b93a;


}




.customer-game-title.dus-title {


color: #d7a938;


}




.game-badge,


.daily-badge {


padding: 4px 7px;

border-radius: 20px;


background: rgba(255,195,0,.08);


border: 1px solid


    rgba(255,195,0,.18);


color: #dcb22e;


font-size: 6px;


font-weight: 900;


}




.main-market-grid,


.customer-main-grid {


display: grid;


grid-template-columns:


    repeat(2,minmax(0,1fr));


gap: 7px;


}




.main-market,

.customer-market {


min-height: 90px;


padding: 9px;


border-radius: 8px;


background: #060a10;


border: 1px solid #17202b;


}




.market-name,


.customer-market-top {


color: #eee;


font-size: 9px;


font-weight: 900;


}




.customer-market {


text-align: left;


cursor: pointer;


}

.customer-market-top {


display: flex;


align-items: center;


justify-content: space-between;


gap: 5px;


font-size: 10px;


}




.customer-market.locked {


opacity: .55;


cursor: not-allowed;


}


.status-pill.locked-pill {


color: #ff4d4d;


}




.deadline,

.customer-deadline {


margin-top: 4px;


color: #747b84;


font-size: 7px;


}




.running-line,


.customer-running {


margin-top: 9px;


color: #38ed82;


font-size: 8px;


font-weight: 800;


}


.public-locked-status,


.locked-status {


margin-top: 9px;


color: #ff4d4d;


font-size: 8px;


font-weight: 900;


}




.customer-locked {


margin-top: 10px;


color: #777;


font-size: 7px;


font-weight: 900;

}




.green-dot {


display: inline-block;


width: 6px;


height: 6px;


margin-right: 4px;


border-radius: 50%;


background: #22ed75;


}




.result-line {


margin-top: 8px;


padding-top: 6px;


border-top: 1px solid #18202a;


color: #858b93;


font-size: 7px;


}

.result-value {


color: #ffffff;
font-size: 18px;
font-weight: 900;


}




.bazi-grid,


.customer-bazi-grid {


display: grid;


grid-template-columns:


    repeat(2,minmax(0,1fr));


gap: 6px;


}




.bazi-box,


.customer-bazi-box {


min-height: 85px;


padding: 8px;


border-radius: 8px;


background: #060a10;

border: 1px solid #141b24;


}




.bazi-top,


.customer-bazi-top {


display: flex;


align-items: center;


justify-content: space-between;


gap: 4px;


}




.bazi-name,


.customer-bazi-top {


font-size: 8px;


font-weight: 900;


}




.bazi-time,

.customer-bazi-time {


color: #777e87;


font-size: 6px;


white-space: nowrap;


}


.customer-bazi-number {


font-size: 12px;
font-weight: 900;
color: #ffd34d;
letter-spacing: .2px;


}




.bazi-status,


.customer-bazi-status {


margin-top: 8px;


color: #35ed7d;


font-size: 7px;


font-weight: 800;


}

.customer-bazi-box {


text-align: left;


cursor: pointer;


}




.customer-bazi-box.locked {


opacity: .5;


cursor: not-allowed;


}




.customer-bazi-status.locked-text {


color: #ff4d4d;


}




.customer-bazi-action {


margin-top: 8px;


padding-top: 6px;


border-top: 1px solid #18202a;


color: #707780;

font-size: 6px;


font-weight: 800;


}


.customer-result-line {
margin-top: 5px;
padding-top: 5px;
border-top: 1px solid #18202a;
display: flex;
align-items: center;
justify-content: space-between;
gap: 4px;
color: #858b93;
font-size: 7px;
font-weight: 800;
}


.customer-result-line strong {
color: #ffffff;
font-size: 18px;
font-weight: 900;
}


.play-btn {


width: 100%;


height: 29px;


margin-top: 8px;


border: none;


border-radius: 6px;

background:


    linear-gradient(


    100deg,


    #e7ad18,


    #ffd452,


    #f4c43b


    );


color: #111;


font-size: 8px;


font-weight: 900;


cursor: pointer;


}




.footer,


.customer-footer {


width: 100%;


padding: 15px 10px 25px;


text-align: center;


border-top: 1px solid #171c22;

background: #030405;


color: #8b8f94;


font-size: 7px;


}


.footer-note {


max-width: 500px;


margin: auto;


padding: 8px;


border: 1px dashed #363c45;


border-radius: 6px;


color: #737981;


font-size: 6px;


line-height: 1.5;


text-align: left;


}




.footer-title {


margin-top: 13px;

color: #c9c9c9;


font-size: 7px;


}




.footer-title span,


.customer-footer-links {


color: #d8ae24;


}




.customer-brand {


color: #ffc928;


font-size: 20px;


font-weight: 900;


letter-spacing: 1px;


}


.customer-header-actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.customer-refresh-btn {
  height: 31px;
  padding: 0 9px;
  border-radius: 7px;
  border: 1px solid rgba(255,195,0,.55);
  background: #12161d;
  color: #ffd33c;
  font-size: 7px;
  font-weight: 900;
}

.customer-refresh-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.customer-refresh-btn:active {
  transform: scale(.98);
}

.profile-mini-btn {


width: 34px;


height: 34px;


border-radius: 50%;

border: 1px solid


    rgba(255,200,30,.4);


background: #151a22;


color: #ffd23b;


cursor: pointer;


}




.customer-main {


width: 100%;


max-width: 520px;


margin: 0 auto;


padding: 12px 10px 25px;


}




.balance-wrap {


display: grid;


grid-template-columns:


    repeat(2,minmax(0,1fr));

gap: 7px;


margin-bottom: 10px;


}




.balance-card {


padding: 11px;


border-radius: 10px;


background:


    linear-gradient(


    145deg,


    #17140c,


    #0c0d10


    );


border: 1px solid


    rgba(255,195,0,.28);


}




.balance-card.exposure {


border-color:

    rgba(255,255,255,.12);


background:


    linear-gradient(


    145deg,


    #121820,


    #0a0d12


    );


}




.balance-card.exposure .balance-value { color: #ff6b6b; }


.balance-label {


color: #8e8e8e;


font-size: 7px;


font-weight: 800;


}




.balance-value {


margin-top: 5px;


color: #45ed8b;

font-size: 19px;


font-weight: 900;


}




.balance-small {


margin-top: 3px;


color: #666;


font-size: 6px;


}




.customer-welcome {


display: flex;


align-items: center;


justify-content: space-between;


padding: 12px;


border-radius: 10px;


background: #0d1219;


border: 1px solid #202936;


margin-bottom: 9px;

}




.customer-welcome-title {


color: #eee;


font-size: 13px;


font-weight: 900;


}




.customer-welcome-sub {


margin-top: 4px;


color: #777f89;


font-size: 7px;


}




.customer-live {


padding: 4px 7px;


border-radius: 20px;


color: #45ed8b;

background: rgba(0,220,100,.08);


border: 1px solid


    rgba(0,220,100,.18);


font-size: 6px;


font-weight: 900;


}




.customer-nav {


display: grid;


grid-template-columns:


    repeat(3,1fr);


gap: 6px;


margin-bottom: 13px;


}




.customer-nav-btn {


height: 40px;


border-radius: 8px;


border: 1px solid #222b36;

background: #0d1218;


color: #858b94;


font-size: 9px;


font-weight: 800;


cursor: pointer;


}




.customer-nav-btn.active {


color: #111;


border-color: #ffc52a;


background:


    linear-gradient(


    135deg,


    #ffe36a,


    #ffbd19


    );


}

.customer-game-sub {


margin-top: 3px;


color: #707780;


font-size: 7px;


}




.customer-notice {


margin: 12px 2px;


padding: 9px;


border-radius: 7px;


background: rgba(255,255,255,.025);


border: 1px dashed #303741;


color: #686f78;


font-size: 6px;


line-height: 1.5;


}




/* ================= BETTING ================= */

.betting-topbar {


display: grid;


grid-template-columns:


    70px 1fr 70px;


align-items: center;


margin-bottom: 10px;


}




.back-btn {


height: 31px;


border-radius: 7px;


border: 1px solid #252d37;


background: #10151c;


color: #c9c9c9;


font-size: 8px;


font-weight: 800;


cursor: pointer;


}

.betting-title {


text-align: center;


color: #f0cc4d;


font-size: 14px;


font-weight: 900;


}




.betting-balance {


text-align: right;


color: #45ed8b;


font-size: 8px;


font-weight: 900;


}




.betting-card {


padding: 11px;


}

.betting-context {


padding: 11px;


border-radius: 9px;


background: #070b10;


border: 1px solid #1b2530;


}




.context-label {


color: #696f77;


font-size: 6px;


font-weight: 900;


}




.context-value {


margin-top: 5px;


color: #f1cd4d;


font-size: 14px;


font-weight: 900;

}




.context-game-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
}

.context-game-row .context-value {
  margin-top: 0;
}

.context-date {
  color: #a9afb6;
  font-size: 8px;
  font-weight: 800;
  white-space: nowrap;
}

.betting-live-status {


margin-top: 10px;


padding: 9px 12px;


border-radius: 10px;


font-size: 10px;


font-weight: 800;


text-align: center;


}




.running-status {


color: #73ff9b;


background: rgba(35,190,92,.1);


border: 1px solid


    rgba(35,190,92,.25);


}




.locked-status {

color: #ff7b7b;


background: rgba(255,70,70,.1);


border: 1px solid


    rgba(255,70,70,.25);


}


.betting-section-title {


margin: 15px 0 7px;


color: #d6d6d6;


font-size: 8px;


font-weight: 900;


letter-spacing: .5px;


}




.bet-type-grid {


display: grid;


grid-template-columns:


    repeat(2,minmax(0,1fr));


gap: 6px;

}




.bet-type-btn {


min-height: 46px;


padding: 7px 6px;


border-radius: 8px;


border: 1px solid #272f39;


background: #0c1117;


color: #b9bec5;


font-size: 11px;


font-weight: 900;


line-height: 1.05;


cursor: pointer;


display: flex;


align-items: center;


justify-content: center;


gap: 6px;


}

.bet-type-reference-number {
font-size: 15px;
font-weight: 900;
letter-spacing: .4px;
line-height: 1;
color: #f2f2f2;
flex: 0 0 auto;
}


.bet-type-label {
font-size: 11px;
font-weight: 900;
white-space: nowrap;
}


.bet-type-btn.selected {


color: #111;


font-size: 11px;


border-color: #ffc52b;


background:


    linear-gradient(


    135deg,


    #ffe36a,


    #ffbc18


    );


}

.bet-type-btn:disabled {


opacity: .35;


cursor: not-allowed;


}




.bet-warning {


margin-top: 7px;


padding: 7px;


border-radius: 7px;


background: rgba(255,50,50,.06);


border: 1px solid


    rgba(255,50,50,.15);


color: #f27b7b;


font-size: 7px;


text-align: center;


}




.rate-box {

display: flex;


align-items: center;


justify-content: space-between;


margin-top: 8px;


padding: 8px 10px;


border-radius: 7px;


background: rgba(255,195,0,.05);


border: 1px solid


    rgba(255,195,0,.12);


color: #888;


font-size: 7px;


}




.rate-box strong {


color: #ffd13b;


font-size: 11px;


}

.number-grid {


display: grid;


grid-template-columns:


    repeat(5,minmax(0,1fr));


gap: 6px;


max-height: none;


overflow-y: visible;


}




.jodi-grid {


grid-template-columns:


    repeat(5,minmax(0,1fr));


}


.number-btn {


min-height: 42px;


display: flex;


flex-direction: column;


align-items: center;


justify-content: center;

gap: 2px;


border-radius: 7px;


border: 1px solid #252d37;


background: #0a0f15;


color: #c4c7ca;


font-size: 9px;


font-weight: 900;


cursor: pointer;


}




.number-btn small {


color: #ffd13b;


font-size: 7px;


}




.number-btn.selected {


color: #111;


border-color: #ffc52b;

background:


    linear-gradient(


    135deg,


    #ffe36a,


    #ffbd19


    );


}




.number-btn.selected small {


color: #111;


}




.patti-groups {


display: flex;


flex-direction: column;


gap: 10px;


max-height: none;


overflow-y: visible;


padding-right: 0;

}




.patti-group {


padding: 9px;


border: 1px solid #202a35;


border-radius: 9px;


background: #080c12;


}




.patti-group-title {


margin-bottom: 7px;


color: #e9bd29;


font-size: 9px;


font-weight: 900;


letter-spacing: .7px;


}




.patti-grid {

display: grid;


grid-template-columns:


    repeat(3,minmax(0,1fr));


gap: 6px;


}




.patti-triple-grid {


grid-template-columns:


    repeat(5,minmax(0,1fr));


}




.amount-grid {


display: grid;


grid-template-columns:


    repeat(4,minmax(0,1fr));


gap: 9px;


padding: 3px 2px;


}




.amount-btn {

width: 54px;
height: 54px;
min-height: 54px;
justify-self: center;


border-radius: 50%;


border: 1px solid #252e38;


background:
    radial-gradient(circle at 35% 30%, #1b222b, #080c12 70%);


color: #e1e4e7;


font-size: 10px;


font-weight: 900;


cursor: pointer;

box-shadow:
    inset 0 0 0 2px rgba(255,195,0,.04),
    0 4px 10px rgba(0,0,0,.25);


}




.amount-btn.selected {


color: #111;


border-color: #ffc52b;


background:
    radial-gradient(circle at 35% 30%, #fff19a, #ffc21d 72%);


box-shadow:
    0 0 0 2px rgba(255,197,43,.18),
    0 6px 14px rgba(255,183,0,.18);


}





/* ================= SELECTED BET BOX ================= */




.selected-bets-panel {


margin-top: 12px;


padding: 10px;


border-radius: 9px;


background: #070b10;


border: 1px solid #242d38;


}




.selected-bets-title {


color: #e9bd29;


font-size: 8px;


font-weight: 900;


letter-spacing: .5px;


}

.selected-bets-empty {


margin-top: 8px;


padding: 10px;


border: 1px dashed #303741;


border-radius: 7px;


color: #666e77;


font-size: 7px;


text-align: center;


}




.selected-bets-list {


display: flex;


flex-direction: column;


gap: 5px;


margin-top: 8px;


max-height: none;


overflow-y: visible;

}




.selected-bet-row {


display: flex;


align-items: center;


justify-content: space-between;


padding: 8px 9px;


border-radius: 6px;


background: #0c1118;


border: 1px solid #1e2732;


color: #eee;


font-size: 8px;


font-weight: 900;


}




.selected-bet-row strong {


color: #ffd13b;


}

.selected-bet-number {
  flex: 1 1 auto;
  min-width: 0;
}

.selected-bet-remove {
  width: 23px;
  height: 23px;
  margin-left: 8px;
  flex: 0 0 23px;
  border: 1px solid rgba(255,70,70,.45);
  border-radius: 6px;
  background: rgba(255,55,55,.12);
  color: #ff5b5b;
  font-size: 17px;
  line-height: 19px;
  font-weight: 900;
  cursor: pointer;
}

.selected-bet-remove:active {
  transform: scale(.96);
}

.selected-bets-total {


display: flex;


align-items: center;


justify-content: space-between;


margin-top: 7px;


padding-top: 7px;


border-top: 1px solid #202832;


color: #8a9199;


font-size: 8px;


}




.selected-bets-total strong {


color: #f1f1f1;


font-size: 10px;


}




.gold-text {


color: #ffd13b !important;

}


.bet-actions {


display: grid;


grid-template-columns:


    1fr 1.6fr;


gap: 7px;


margin-top: 10px;


}




.clear-bet-btn {


height: 45px;


border-radius: 9px;


border: 1px solid #303944;


background: #0c1118;


color: #b8bec5;


font-size: 9px;


font-weight: 900;


cursor: pointer;


}

.place-bet-btn {


width: 100%;


height: 45px;


border: none;


border-radius: 9px;


background:


    linear-gradient(


    135deg,


    #ffe36a,


    #ffb900


    );


color: #111;


font-size: 10px;


font-weight: 900;


cursor: pointer;


}

.place-bet-btn:disabled {


opacity: .5;


cursor: not-allowed;


}




.virtual-note {


margin-top: 8px;


color: #606770;


font-size: 6px;


line-height: 1.5;


text-align: center;


}




/* ================= CUSTOMER RESULT HISTORY ================= */

.customer-result-game-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0 0 10px;}
.customer-result-game-tab{min-height:36px;padding:7px 5px;border-radius:8px;border:1px solid #2b3440;background:#0b1016;color:#aeb4bd;font-size:8px;font-weight:900;cursor:pointer;}
.customer-result-game-tab.active{color:#111;border-color:#ffc52a;background:linear-gradient(135deg,#ffe36a,#ffbd19);}
.customer-result-panel{background:#f5f5f5;border:1px solid rgba(255,197,42,.65);border-radius:9px;overflow:hidden;margin-bottom:14px;}
.customer-result-table-scroll{width:100%;max-width:100%;overflow-x:hidden;}
.customer-result-main-table{width:100%;min-width:0;background:#f7dfbd;color:#111;}
.customer-result-main-header,.customer-result-main-row{display:grid;grid-template-columns:82px repeat(5,minmax(0,1fr));width:100%;}
.customer-result-main-header>div{min-width:0;min-height:48px;display:flex;align-items:center;justify-content:center;border-right:1px solid #2aa8b2;border-bottom:1px solid #2aa8b2;background:#ffc400;font-size:12px;font-weight:900;text-transform:uppercase;}
.customer-result-main-row>div{min-width:0;min-height:102px;border-right:1px solid #36aeb8;border-bottom:1px solid #36aeb8;}
.customer-result-week-date{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:5px;text-align:center;font-size:8px;font-weight:900;line-height:1.25;}
.customer-result-week-date span:nth-child(2){font-size:7px;font-weight:700;}
.customer-result-main-day{padding:0;background:#f8dfbc;}
.customer-result-main-cell{min-width:0;min-height:102px;display:grid;grid-template-columns:24px minmax(0,1fr) 24px;align-items:center;justify-items:center;padding:4px 3px;box-sizing:border-box;}
.customer-result-patti{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;min-height:58px;font-size:11px;font-weight:900;line-height:1.05;}
.customer-result-patti span{display:block;}
.customer-result-patti-left,.customer-result-patti-right{color:#111;}
.customer-result-main-number{min-width:36px;display:flex;align-items:center;justify-content:center;gap:0;color:#111;font-size:21px;font-weight:900;line-height:1;letter-spacing:-1px;}
.customer-result-main-number span{display:inline-block;}
.customer-result-day-card{background:#f7dfbd;border-bottom:1px solid #39aeb8;}
.customer-result-day-card:last-child{border-bottom:0;}
.customer-result-day-title{padding:9px 10px;background:#ffc400;border-bottom:1px solid #2aa8b2;color:#111;font-size:10px;font-weight:900;text-align:left;}
.customer-result-bazi-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));}
.customer-result-bazi-grid.dus-grid{grid-template-columns:repeat(10,minmax(0,1fr));}
.customer-result-bazi-box{min-height:92px;padding:5px 3px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border-right:1px solid #39aeb8;box-sizing:border-box;}
.customer-result-bazi-box:last-child{border-right:0;}
.customer-result-bazi-label{color:#b07a00;font-size:7px;font-weight:900;}
.customer-result-bazi-patti{color:#111;font-size:13px;font-weight:900;letter-spacing:.4px;}
.customer-result-bazi-single{color:#111;font-size:20px;font-weight:900;line-height:1;}
.customer-result-empty{padding:24px 12px;text-align:center;color:#777f89;font-size:9px;background:#f7f7f7;}
@media (max-width:560px){.customer-result-game-tab{font-size:7px;}.customer-result-main-table{width:100%;min-width:0;}.customer-result-main-header,.customer-result-main-row{grid-template-columns:58px repeat(5,minmax(0,1fr));}.customer-result-main-header>div{min-height:38px;font-size:8px;}.customer-result-main-row>div{min-height:84px;}.customer-result-main-cell{min-height:84px;grid-template-columns:14px minmax(0,1fr) 14px;padding:2px 1px;}.customer-result-patti{font-size:8px;min-height:46px;}.customer-result-main-number{font-size:17px;min-width:0;}.customer-result-week-date{font-size:6.5px;padding:3px 1px;}.customer-result-week-date span:nth-child(2){font-size:6px;}.customer-result-bazi-box{min-height:82px;}.customer-result-bazi-label{font-size:6px;}.customer-result-bazi-patti{font-size:10px;}.customer-result-bazi-single{font-size:17px;}}

/* ================= HISTORY ================= */




.page-heading {


margin: 4px 2px 10px;


}

.page-heading-title {


color: #f0cd4e;


font-size: 16px;


font-weight: 900;


}




.page-heading-sub {


margin-top: 3px;


color: #777f89;


font-size: 7px;


}




.history-tabs {


display: grid;


grid-template-columns:


    repeat(4,minmax(0,1fr));


gap: 5px;


margin-bottom: 10px;

}




.history-tab {


min-height: 38px;


padding: 0 4px;


border-radius: 7px;


border: 1px solid #252e38;


background: #0c1118;


color: #858b93;


font-size: 7px;


font-weight: 900;


cursor: pointer;


white-space: nowrap;


}


.history-tab.active {


color: #111;


border-color: #ffc52b;


background:


    linear-gradient(

    135deg,


    #ffe36a,


    #ffbd19


    );


}




.empty-card,


.profile-card {


padding: 18px 12px;


border-radius: 10px;


background: #0d1219;


border: 1px solid #202936;


text-align: center;


}




.empty-icon {


color: #dcb22e;


font-size: 22px;

}




.empty-title {


margin-top: 7px;


color: #eee;


font-size: 13px;


font-weight: 900;


}




.empty-text {


margin-top: 5px;


color: #777f89;


font-size: 7px;


line-height: 1.5;


}




.empty-play-btn {


margin-top: 12px;


height: 36px;

padding: 0 14px;


border: none;


border-radius: 7px;


background:


    linear-gradient(


    135deg,


    #ffe36a,


    #ffbd19


    );


color: #111;


font-size: 8px;


font-weight: 900;


cursor: pointer;


}




.history-list,


.reports-table-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid rgba(255, 209, 59, .14);
  border-radius: 12px;
}
.reports-table {
  width: max-content;
  min-width: 1500px;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 11px;
}
.reports-table th, .reports-table td {
  padding: 9px 10px;
  border-bottom: 1px solid rgba(255,255,255,.07);
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
}
.reports-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #17120b;
  color: #ffd13b;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .04em;
}
.reports-table td { color: #edf1f5; font-weight: 600; }
.reports-table tr:last-child td { border-bottom: 0; }
.reports-strong { color: #ffffff !important; font-weight: 800 !important; }
.reports-bet-value { color: #ffd84d !important; font-weight: 800 !important; }
.reports-source {
  display: inline-block;
  padding: 3px 7px;
  border-radius: 10px;
  font-size: 8px;
  font-weight: 900;
}
.reports-source-online { color: #67e8f9; background: rgba(34,211,238,.12); border: 1px solid rgba(34,211,238,.25); }
.reports-source-agent { color: #c4b5fd; background: rgba(139,92,246,.12); border: 1px solid rgba(139,92,246,.25); }
.reports-status {
  display: inline-block;
  padding: 3px 7px;
  border-radius: 10px;
  background: rgba(255,195,0,.10);
  border: 1px solid rgba(255,195,0,.20);
  color: #ffd84d;
  font-size: 8px;
  font-weight: 900;
}
.reports-status-won { background: rgba(34,197,94,.14); border-color: rgba(34,197,94,.38); color: #4ade80; }
.reports-status-loss, .reports-status-lost { background: rgba(239,68,68,.14); border-color: rgba(239,68,68,.38); color: #f87171; }

.statement-list {


display: flex;

flex-direction: column;


gap: 7px;


}




.history-card,


.statement-card {


padding: 10px;


border-radius: 9px;


background: #0c1118;


border: 1px solid #202a35;


}




.history-card-top,


.statement-card {


display: flex;


align-items: center;


justify-content: space-between;


gap: 8px;


}

.history-game,


.statement-type {


color: #f0cd4e;


font-size: 9px;


font-weight: 900;


}


.history-market,


.statement-date {


margin-top: 3px;


color: #777f89;


font-size: 6px;


}




.history-status {


padding: 4px 6px;


border-radius: 10px;


background: rgba(255,195,0,.08);

color: #dcb22e;


font-size: 6px;


font-weight: 900;


}




.history-details {


display: grid;


grid-template-columns:


    repeat(3,1fr);


gap: 5px;


margin-top: 9px;


}




.history-details > div {


padding: 6px;


border-radius: 6px;


background: #080c11;


}


.history-details span {

display: block;


color: #646b74;


font-size: 5px;


}




.history-details strong {


display: block;


margin-top: 3px;


color: #ddd;


font-size: 7px;


word-break: break-word;


}




/* Customer History horizontal table */

.history-table-scroll {
width: 100%;
overflow-x: auto;
-webkit-overflow-scrolling: touch;
border: 1px solid #202a35;
border-radius: 9px;
background: #0c1118;
}

.history-table {
width: 100%;
min-width: 1100px;
table-layout: fixed;
border-collapse: collapse;
font-size: 9px;
}

.history-table th,
.history-table td {
text-align: left;
vertical-align: middle;
}

.history-table th {
padding: 8px 9px;
white-space: nowrap;
background: #151c25;
border-bottom: 1px solid #3a4350;
color: #f0cd4e;
font-size: 8px;
font-weight: 900;
}

.history-table td {
padding: 7px 9px;
white-space: nowrap;
border-bottom: 1px solid #202a35;
color: #edf1f5;
font-size: 8px;
font-weight: 650;
}

.history-table th:nth-child(1), .history-table td:nth-child(1) { width: 150px; }
.history-table th:nth-child(2), .history-table td:nth-child(2) { width: 125px; }
.history-table th:nth-child(3), .history-table td:nth-child(3) { width: 190px; }
.history-table th:nth-child(4), .history-table td:nth-child(4) { width: 75px; }
.history-table th:nth-child(5), .history-table td:nth-child(5) { width: 90px; }
.history-table th:nth-child(6), .history-table td:nth-child(6) { width: 110px; }
.history-table th:nth-child(7), .history-table td:nth-child(7) { width: 180px; }
.history-table th:nth-child(8), .history-table td:nth-child(8) { width: 95px; }
.history-table th:nth-child(9), .history-table td:nth-child(9) { width: 70px; }
.history-table th:nth-child(10), .history-table td:nth-child(10) { width: 90px; }
.history-table th:nth-child(11), .history-table td:nth-child(11) { width: 100px; }

.history-table tbody tr:last-child td {
border-bottom: none;
}

.history-table tbody tr:hover {
background: #111923;
}

.history-table-datetime {
color: #ffffff !important;
font-weight: 800 !important;
line-height: 1.35;
}

.history-table-game,
.history-table-bet-type {
color: #f0cd4e !important;
font-weight: 850 !important;
}

.history-table-number,
.history-table-amount,
.history-table-rate {
color: #ffd84d !important;
font-weight: 900 !important;
}

.history-table-status {
display: inline-block;
padding: 3px 6px;
border-radius: 10px;
background: rgba(255,195,0,.10);
border: 1px solid rgba(255,195,0,.20);
color: #ffd84d;
font-size: 7px;
font-weight: 900;
}


.history-table-status-won {
background: rgba(34,197,94,.14);
border-color: rgba(34,197,94,.38);
color: #4ade80;
}

.history-table-status-loss,
.history-table-status-lost {
background: rgba(239,68,68,.14);
border-color: rgba(239,68,68,.38);
color: #f87171;
}

.history-pagination {
display: flex;
align-items: center;
justify-content: space-between;
gap: 10px;
margin-top: 10px;
padding: 8px 0;
}

.history-pagination-info,
.history-pagination-page {
color: #d7dde5;
font-size: 8px;
font-weight: 700;
}

.history-pagination-controls {
display: flex;
align-items: center;
gap: 7px;
}

.history-pagination-btn {
padding: 6px 9px;
border-radius: 6px;
border: 1px solid #3a4350;
background: #111820;
color: #f0cd4e;
font-size: 7px;
font-weight: 900;
cursor: pointer;
}

.history-pagination-btn:disabled {
opacity: .35;
cursor: not-allowed;
}

.statement-table-scroll {
width: 100%;
overflow-x: auto;
-webkit-overflow-scrolling: touch;
border: 1px solid #202a35;
border-radius: 9px;
background: #0c1118;
}

.statement-table {
width: 100%;
min-width: 860px;
table-layout: fixed;
border-collapse: collapse;
font-size: 9px;
}

.statement-table th {
padding: 8px 9px;
text-align: left;
white-space: nowrap;
background: #151c25;
border-bottom: 1px solid #3a4350;
color: #f0cd4e;
font-size: 8px;
font-weight: 900;
}

.statement-table td {
padding: 8px 9px;
white-space: nowrap;
border-bottom: 1px solid #202a35;
color: #edf1f5;
font-size: 8px;
font-weight: 700;
}

.statement-col-datetime,
.statement-table-datetime {
width: 190px;
text-align: left !important;
}

.statement-col-type,
.statement-table-type-cell {
width: 95px;
text-align: center !important;
}

.statement-col-transaction,
.statement-table-transaction {
width: 240px;
text-align: left !important;
}

.statement-col-amount,
.statement-table-amount {
width: 140px;
text-align: right !important;
}

.statement-col-balance,
.statement-table-balance {
width: 140px;
text-align: right !important;
}
.statement-table tbody tr:last-child td {
border-bottom: none;
}

.statement-table tbody tr:hover {
background: #111923;
}

.statement-table-datetime {
color: #ffffff !important;
font-weight: 800 !important;
}

.statement-table-type {
font-weight: 900;
}

.statement-table-type.credit,
.statement-table-credit {
color: #45ed8b !important;
font-weight: 900 !important;
}

.statement-table-type.debit,
.statement-table-debit {
color: #ff8585 !important;
font-weight: 900 !important;
}

.statement-table-balance {
color: #d7dde5 !important;
font-weight: 800 !important;
}

.statement-pagination {
display: flex;
align-items: center;
justify-content: space-between;
gap: 10px;
margin-top: 10px;
padding: 8px 0;
}

.statement-pagination-info,
.statement-pagination-page {
color: #d7dde5;
font-size: 8px;
font-weight: 700;
}

.statement-pagination-controls {
display: flex;
align-items: center;
gap: 7px;
}

.statement-pagination-btn {
padding: 6px 9px;
border-radius: 6px;
border: 1px solid #3a4350;
background: #111820;
color: #f0cd4e;
font-size: 7px;
font-weight: 900;
cursor: pointer;
}

.statement-pagination-btn:disabled {
opacity: .35;
cursor: not-allowed;
}

.profile-name {


color: #f0cd4e;


font-size: 18px;


font-weight: 900;


}

.profile-label {


margin-top: 4px;


color: #777;


font-size: 7px;


}


.profile-mobile {


margin-top: 8px;
color: #d9d9d9;
font-size: 10px;
font-weight: 800;
word-break: break-word;


}




.profile-menu {


margin-top: 10px;


display: flex;


flex-direction: column;


gap: 6px;


}

.profile-menu button {


height: 45px;


display: flex;


align-items: center;


justify-content: space-between;


padding: 0 12px;


border-radius: 8px;


border: 1px solid #222b36;


background: #0d1218;


color: #ccc;


font-size: 8px;


font-weight: 800;


cursor: pointer;


}


.profile-menu button.logout-btn {


background: #d92f2f;


border-color: #ff5a5a;


color: #fff;


font-weight: 900;


box-shadow: 0 0 0 1px rgba(255, 80, 80, .12), 0 4px 14px rgba(217, 47, 47, .18);


}




.profile-menu button.logout-btn:hover {


background: #ef3b3b;


border-color: #ff7777;


}




.profile-menu button.logout-btn:active {


background: #c62828;


}




.statement-right {


text-align: right;


}

.statement-right .credit {


color: #45ed8b;


font-size: 10px;


font-weight: 900;


}


.statement-right .debit {


color: #ff8585;


font-size: 10px;


font-weight: 900;


}




.statement-balance {


margin-top: 3px;


color: #777;


font-size: 6px;


}




/* ================= BOTTOM NAV ================= */

.customer-bottom-nav {


display: grid;


grid-template-columns:


    repeat(3,1fr);


gap: 6px;


margin-top: 13px;


}




.customer-bottom-nav button {


height: 38px;


border-radius: 7px;


border: 1px solid #222b36;


background: #0d1218;


color: #858b94;


font-size: 8px;


font-weight: 800;


cursor: pointer;

}




.customer-bottom-nav .selected-bottom {


color: #111;


border-color: #ffc52a;


background:


    linear-gradient(


    135deg,


    #ffe36a,


    #ffbd19


    );


}




/* ================= MODAL ================= */




.modal-bg {


position: fixed;


inset: 0;


z-index: 1000;

display: flex;


align-items: center;


justify-content: center;


padding: 15px;


background: rgba(0,0,0,.78);


}




.modal {


width: 100%;


max-width: 390px;


max-height: 90vh;


overflow-y: auto;


padding: 18px;


border-radius: 14px;


background:


    linear-gradient(


    145deg,


    #111720,

    #080b10


    );


border: 1px solid #303945;


box-shadow:


    0 20px 60px


    rgba(0,0,0,.55);


}




.modal h2 {


margin: 0;


color: #f0cd4e;


font-size: 19px;


}




.modal p {


color: #777f89;


font-size: 8px;


}


.input {

width: 100%;


height: 43px;


margin-top: 8px;


padding: 0 11px;


border-radius: 8px;


border: 1px solid #303944;


outline: none;


background: #090d13;


color: #fff;


font-size: 12px;


}




.input:focus {


border-color: #d7ad2c;


}




.verify-btn {


width: 100%;

height: 42px;


margin-top: 9px;


border: none;


border-radius: 8px;


background:


    linear-gradient(


    135deg,


    #ffe36a,


    #ffbd19


    );


color: #111;


font-size: 9px;


font-weight: 900;


cursor: pointer;


}




.otp-row {


display: flex;


gap: 6px;

}




.otp-row .input {


flex: 1;


}




.otp-btn {


margin-top: 8px;


min-width: 95px;


border-radius: 8px;


border: 1px solid #303944;


background: #111720;


color: #dcb22e;


font-size: 7px;


font-weight: 900;


}




.otp-message,

.otp-error,


.otp-success,


.verified-mobile {


margin-top: 8px;


padding: 8px;


border-radius: 7px;


font-size: 7px;


text-align: center;


}




.otp-message {


color: #dcb22e;


background: rgba(255,195,0,.06);


}




.otp-error {


color: #ff8080;


background: rgba(255,50,50,.07);


}

.otp-success,


.verified-mobile {


color: #45ed8b;


background: rgba(0,220,100,.06);


}




.modal-actions {


display: flex;


gap: 8px;


margin-top: 12px;


}


.modal-actions button {


flex: 1;


height: 43px;


border-radius: 8px;


font-size: 8px;


font-weight: 900;

cursor: pointer;


}




.cancel {


border: 1px solid #333;


background: #151515;


color: #aaa;


}




.continue {


border: none;


background:


    linear-gradient(


    135deg,


    #ffe66c,


    #ffb900


    );


color: #111;


}

/* ADMIN PANEL */
.admin-shell{min-height:100vh;background:radial-gradient(circle at 50% -10%,rgba(255,195,0,.10),transparent 34%),linear-gradient(180deg,#05070a 0%,#090c12 60%,#030405 100%);color:#fff}
.admin-header{width:100%;padding:14px 12px;border-bottom:1px solid rgba(255,195,0,.24);background:linear-gradient(180deg,#0d1118,#080b10);display:flex;align-items:center;justify-content:space-between;gap:10px}
.admin-brand{font-size:18px;font-weight:900;letter-spacing:1px;color:#ffc928}.admin-subtitle{margin-top:3px;font-size:7px;color:#9a9fa8;letter-spacing:.8px;font-weight:800}.admin-header-actions{display:flex;align-items:center;gap:6px}.admin-role-badge{padding:7px 8px;border-radius:7px;border:1px solid rgba(255,195,0,.45);color:#ffd33c;background:#11151c;font-size:7px;font-weight:900}.admin-logout-btn{height:31px;padding:0 9px;border-radius:7px;border:1px solid rgba(255,70,70,.8);background:#b51f2a;color:#fff;font-size:7px;font-weight:900}.admin-main{width:100%;max-width:720px;margin:0 auto;padding:12px}.admin-welcome-card,.admin-panel-card,.admin-supply-card{border:1px solid rgba(255,195,0,.18);background:linear-gradient(145deg,rgba(20,24,31,.96),rgba(8,11,16,.96));border-radius:13px;padding:14px;margin-bottom:10px}.admin-welcome-card{display:flex;justify-content:space-between;align-items:center;gap:10px}.admin-section-kicker{font-size:7px;color:#b99322;font-weight:900;letter-spacing:1.2px}.admin-welcome-card h1,.admin-supply-card h2{margin:5px 0 4px;font-size:18px;color:#fff}.admin-welcome-card p,.admin-supply-card p{margin:0;color:#8e949e;font-size:8px;line-height:1.55}.admin-refresh-btn{min-width:72px;height:32px;border-radius:7px;border:1px solid rgba(255,195,0,.55);background:#12161d;color:#ffd33c;font-size:7px;font-weight:900}.admin-success{margin-bottom:10px;padding:9px;border-radius:8px;border:1px solid rgba(50,220,120,.35);background:rgba(20,120,65,.16);color:#55ee9a;font-size:8px}.admin-available-value{color:#45ed8b !important}.admin-exposure-value{color:#ff6b6b !important}..admin-error{margin-bottom:10px;padding:9px;border-radius:8px;border:1px solid rgba(255,70,70,.35);background:rgba(130,20,25,.18);color:#ff8a8a;font-size:8px}.admin-stat-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px}.admin-account-management{border:1px solid rgba(255,195,0,.18);background:linear-gradient(145deg,rgba(20,24,31,.96),rgba(8,11,16,.96));border-radius:13px;padding:14px;margin-bottom:10px}.admin-account-header{margin-bottom:10px}.admin-account-header h2{margin:5px 0 4px;font-size:15px;color:#fff}.admin-account-header p{margin:0;color:#8e949e;font-size:8px;line-height:1.55}.admin-account-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.admin-account-card{min-height:72px;padding:10px;border-radius:9px;border:1px solid #1d232c;background:#0a0d12;display:flex;flex-direction:column;justify-content:space-between}.admin-account-card.primary{border-color:rgba(255,195,0,.34)}.admin-account-card.highlight{border-color:rgba(255,195,0,.28);background:linear-gradient(145deg,#11140e,#0a0d12)}.admin-account-card span{font-size:6px;color:#777;font-weight:900;letter-spacing:.7px}.admin-account-card strong{font-size:14px;color:#ffd13b;word-break:break-word;margin:4px 0}.admin-account-card small{font-size:6px;color:#666;line-height:1.35}.admin-account-detail-panel{padding:14px}.admin-account-detail-intro{margin:5px 0 12px;color:#8e949e;font-size:8px;line-height:1.55}.admin-account-grid-detail{grid-template-columns:repeat(2,minmax(0,1fr))}.admin-stat-card{min-height:78px;padding:11px;border-radius:11px;border:1px solid rgba(255,195,0,.14);background:#0d1117;display:flex;flex-direction:column;justify-content:space-between}.admin-stat-card span{font-size:6px;color:#777;font-weight:900;letter-spacing:.8px}.admin-stat-card strong{font-size:16px;color:#ffd13b;word-break:break-word}.admin-module-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px}.admin-module-card{min-height:68px;text-align:left;padding:10px;border-radius:10px;border:1px solid #242b35;background:#0d1117;color:#fff}.admin-module-card.active{border-color:rgba(255,195,0,.5)}.admin-module-card b{display:block;color:#ffd13b;font-size:9px;margin-bottom:4px}.admin-module-card small{display:block;color:#777;font-size:7px}.admin-form{display:flex;flex-direction:column;gap:10px}.admin-form-field{display:flex;flex-direction:column;gap:5px}.admin-form-field label{font-size:7px;color:#777;font-weight:900;letter-spacing:.8px}.admin-form-input{width:100%;height:40px;padding:0 11px;border-radius:8px;border:1px solid #252c36;background:#090c11;color:#fff;font-size:10px;outline:none}.admin-form-input:focus{border-color:rgba(255,195,0,.55)}.admin-form-input::placeholder{color:#555}.admin-form-note{padding:9px;border-radius:7px;background:#0a0d12;color:#777;font-size:7px;line-height:1.5}.admin-create-btn{width:100%;height:40px;border-radius:8px;border:1px solid rgba(255,195,0,.55);background:#15130b;color:#ffd13b;font-size:8px;font-weight:900;cursor:pointer}.admin-create-btn:disabled{opacity:.55;cursor:not-allowed}.admin-create-btn:active{transform:scale(.99)}.admin-panel-title{font-size:10px;color:#ffd13b;font-weight:900;margin-bottom:9px}.admin-panel-title-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:9px}.admin-empty{padding:13px;border-radius:8px;background:#0a0d12;color:#777;text-align:center;font-size:8px}.admin-agent-list{display:flex;flex-direction:column;gap:6px}.admin-agent-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px;border-radius:8px;background:#0a0d12;border:1px solid #1d232c}.admin-agent-row b{display:block;color:#fff;font-size:8px}.admin-agent-row small{display:block;color:#666;font-size:6px;margin-top:3px;word-break:break-all}.admin-status{padding:5px 6px;border-radius:6px;background:#301318;color:#ff8a8a;font-size:6px;font-weight:900}.admin-status.active{background:rgba(0,150,70,.12);color:#55ee9a}.bet-analyzer-selector-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;align-items:end;margin-top:10px}.bet-analyzer-analyze-btn{height:40px;background:#ffd21f;color:#090b10;border-color:#ffd21f;font-size:9px}.bet-analyzer-session-header{padding:12px;border:1px solid rgba(255,195,0,.55);border-left:4px solid #ffd13b;border-radius:10px;background:linear-gradient(145deg,rgba(20,24,31,.96),rgba(8,11,16,.96))}.bet-analyzer-session-header b{display:block;color:#ffd13b;font-size:14px}.bet-analyzer-session-header small{display:block;color:#c5cad1;font-size:9px;margin-top:5px;line-height:1.45}.bet-analyzer-section{padding:0;overflow:hidden}.bet-analyzer-accordion{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px;background:transparent;border:0;color:#fff;text-align:left;cursor:pointer}.bet-analyzer-accordion span{display:block;min-width:0}.bet-analyzer-accordion b{display:block;color:#ffd13b;font-size:12px}.bet-analyzer-accordion small{display:block;color:#8e949e;font-size:8px;line-height:1.45;margin-top:4px}.bet-analyzer-accordion strong{color:#ffd13b;font-size:18px;flex:0 0 auto}.bet-analyzer-accordion.open{border-bottom:1px solid rgba(255,195,0,.18)}.bet-analyzer-content{padding:12px}.bet-analyzer-rate-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 11px;margin-bottom:9px;border:1px solid rgba(255,195,0,.5);border-radius:8px;background:#0a0d12;color:#fff;font-size:9px}.bet-analyzer-rate-row strong{color:#ffd13b;font-size:18px}.bet-analyzer-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.bet-analyzer-number-card{min-width:0;min-height:92px;padding:10px 7px;border-radius:9px;background:#0a0d12;border:1px solid #252c36;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.bet-analyzer-number-card.has-bet{border-color:#22d96b;background:linear-gradient(145deg,rgba(0,100,45,.22),rgba(10,13,18,.96))}.bet-analyzer-number-card.no-bet{border-color:rgba(255,195,0,.42)}.bet-analyzer-number-card b{display:block;color:#fff;font-size:18px;line-height:1.1}.bet-analyzer-number-card strong{display:block;color:#45ed8b;font-size:12px;margin-top:7px;white-space:nowrap}.bet-analyzer-number-card.no-bet strong{color:#aeb4c8}.bet-analyzer-number-card small{display:block;color:#c9cdd6;font-size:7px;margin-top:6px;line-height:1.25}.bet-analyzer-total{margin-top:9px;padding:11px;border:1px solid rgba(255,195,0,.55);border-radius:9px;background:linear-gradient(145deg,rgba(35,30,8,.75),rgba(10,13,18,.96));text-align:center}.bet-analyzer-total span{display:block;color:#fff;font-size:8px;letter-spacing:.5px}.bet-analyzer-total strong{display:block;color:#ffd13b;font-size:22px;margin-top:4px}.bet-analyzer-subsection{margin-bottom:12px}.bet-analyzer-subtitle{color:#ffd13b;font-size:10px;font-weight:900;margin-bottom:7px;padding:7px 8px;border-left:3px solid #ffd13b;background:#0a0d12;border-radius:6px}@media(max-width:700px){.bet-analyzer-selector-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.bet-analyzer-analyze-btn{grid-column:span 2}.bet-analyzer-grid{grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}.bet-analyzer-number-card{min-height:78px;padding:8px 3px}.bet-analyzer-number-card b{font-size:14px}.bet-analyzer-number-card strong{font-size:10px;margin-top:5px}.bet-analyzer-number-card small{font-size:6px;margin-top:4px}.bet-analyzer-total strong{font-size:19px}.bet-analyzer-session-header small{font-size:9px;line-height:1.5}}.admin-wallet-lookup-card{border-color:rgba(255,195,0,.22)}
.admin-wallet-lookup-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;align-items:center}
.admin-wallet-lookup-row .admin-small-action{height:40px;min-width:68px}
.admin-wallet-lookup-results{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.admin-wallet-result-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px;border-radius:8px;background:#0a0d12;border:1px solid #1d232c}
.admin-wallet-result-row b{display:block;color:#fff;font-size:8px}
.admin-wallet-result-row small{display:block;color:#666;font-size:6px;margin-top:3px;word-break:break-all}
.admin-wallet-result-balances{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px 9px}
.admin-wallet-result-balances span{font-size:6px;color:#777;white-space:nowrap}
.admin-wallet-result-balances strong{color:#ffd13b;font-size:7px}.admin-pagination{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:9px}.admin-pagination span{font-size:7px;color:#777;font-weight:900}.admin-small-action{cursor:pointer}
@media (min-width:600px){.admin-stat-grid{grid-template-columns:repeat(5,minmax(0,1fr))}.admin-account-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.admin-account-grid-detail{grid-template-columns:repeat(3,minmax(0,1fr))}.admin-module-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}

@media (max-width: 380px) {


.patti-grid {


 grid-template-columns:


    repeat(2,minmax(0,1fr));


}




.history-tab {


 font-size: 6px;


}




.amount-grid {


 grid-template-columns:


    repeat(2,1fr);


}




.history-details {


 grid-template-columns:

    repeat(2,1fr);


}


}



/* =========================================================
   APNA MATKA PREMIUM GAME LOBBY — PUBLIC + CUSTOMER HOME
   Visual-only override. Existing game/auth/wallet logic unchanged.
   ========================================================= */

.app{
  position:relative;
  min-height:100vh;
  background:
    radial-gradient(circle at 8% 10%, rgba(255,193,7,.10), transparent 18%),
    radial-gradient(circle at 92% 28%, rgba(255,193,7,.08), transparent 18%),
    linear-gradient(135deg, rgba(255,193,7,.045) 0 1px, transparent 1px 55px),
    linear-gradient(315deg, rgba(255,193,7,.035) 0 1px, transparent 1px 75px),
    linear-gradient(180deg,#04070b 0%,#070b11 52%,#020305 100%);
}

.header,
.customer-header{
  padding:16px 12px 13px;
  background:linear-gradient(180deg,#080c12 0%,#05080d 100%);
  border-bottom:1px solid rgba(255,193,7,.30);
}

.header-inner,
.customer-header-inner,
.welcome,
.games,
.customer-main{
  max-width:680px;
}

.brand-row,
.customer-header-inner{
  gap:12px;
}

.brand-lockup{
  display:flex;
  align-items:center;
  gap:9px;
  min-width:0;
}

.brand-crown{
  flex:0 0 auto;
  color:#ffd33d;
  font-size:35px;
  line-height:1;
  text-shadow:0 0 14px rgba(255,200,30,.30);
  transform:translateY(-1px);
}

.brand,
.customer-brand{
  color:#f4c542;
  font-size:25px;
  line-height:1;
  font-weight:900;
  letter-spacing:1.1px;
  white-space:nowrap;
}

.brand-light{
  color:#f5f5f5;
}

.brand-subtitle,
.customer-subtitle{
  margin-top:5px;
  color:#e1bd45;
  font-size:9px;
  font-weight:700;
  letter-spacing:1.7px;
  text-transform:uppercase;
}

.auth-buttons{
  gap:8px;
}

.auth-btn{
  min-width:76px;
  height:40px;
  padding:0 14px;
  border-radius:9px;
  border:1px solid rgba(255,199,32,.72);
  background:#080d14;
  color:#ffd33d;
  font-size:11px;
  font-weight:900;
}

.auth-btn.signup{
  background:linear-gradient(135deg,#ffe46b,#ffbd19);
  color:#111;
  border-color:#ffd54a;
}

.support-row{
  gap:10px;
  margin-top:12px;
}

.support-btn{
  min-height:40px;
  border-radius:8px;
  background:linear-gradient(180deg,#101821,#080d14);
  border:1px solid #26313d;
  color:#f0f0f0;
  font-size:12px;
  font-weight:800;
  letter-spacing:.2px;
}

.support-btn::before{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:24px;
  height:24px;
  margin-right:7px;
  border-radius:50%;
  font-size:15px;
  font-weight:900;
}

.support-btn:nth-child(1)::before{
  content:"◉";
  color:#23ed77;
  background:rgba(35,237,119,.12);
}

.support-btn:nth-child(2)::before{
  content:"➤";
  color:#4bb9ff;
  background:rgba(75,185,255,.12);
}

.welcome{
  margin:0 auto;
  padding:15px 12px 12px;
  text-align:center;
}

.welcome > h1{
  margin:0;
  padding:15px 12px 12px;
  border:1px solid rgba(255,199,32,.60);
  border-radius:12px;
  background:
    linear-gradient(135deg,rgba(255,196,24,.13),transparent 22%,rgba(255,196,24,.05) 78%,rgba(255,196,24,.13));
  box-shadow:inset 0 0 25px rgba(255,193,7,.035);
  color:#f2f2f2;
  font-size:20px;
  font-weight:900;
}

.welcome-accent{
  color:#f5c632;
}

.welcome > h1::first-letter{
  color:#ffd43e;
}

.welcome p{
  margin:8px 10px 0;
  color:#b8bdc5;
  font-size:11px;
  line-height:1.45;
}

.today-title,
.customer-section-title{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:14px;
  margin:14px 0 11px;
  color:#f4c83e;
  font-size:18px;
  font-weight:900;
  letter-spacing:.5px;
}

.today-title::before,
.today-title::after,
.customer-section-title::before,
.customer-section-title::after{
  content:"";
  width:58px;
  height:2px;
  background:linear-gradient(90deg,transparent,#f4c83e);
  border-radius:2px;
}

.today-title::after,
.customer-section-title::after{
  background:linear-gradient(90deg,#f4c83e,transparent);
}

.games{
  padding:0 12px 24px;
}

.game-card,
.customer-game-card{
  margin-bottom:13px;
  padding:13px;
  border-radius:13px;
  background:
    linear-gradient(145deg,rgba(17,23,30,.98),rgba(5,9,14,.98));
  border:1px solid rgba(255,194,18,.46);
  box-shadow:0 7px 24px rgba(0,0,0,.25),inset 0 0 22px rgba(255,193,7,.025);
}

.game-head,
.customer-game-header{
  margin-bottom:11px;
  min-height:40px;
}

.game-title,
.customer-game-title{
  display:flex;
  align-items:center;
  gap:9px;
  color:#f4c83e;
  font-size:21px;
  line-height:1.1;
  font-weight:900;
}

.game-title::before,
.customer-game-title::before{
  display:inline-block;
  width:30px;
  flex:0 0 30px;
  text-align:center;
  color:#ffd43d;
  font-size:25px;
  line-height:1;
  text-shadow:0 0 10px rgba(255,200,30,.20);
}

.games > .game-card:nth-child(1) .game-title::before,
.customer-main > .customer-game-card:nth-of-type(1) .customer-game-title::before{
  content:"♛";
}

.games > .game-card:nth-child(2) .game-title::before,
.customer-main > .customer-game-card:nth-of-type(2) .customer-game-title::before{
  content:"♜";
}

.games > .game-card:nth-child(3) .game-title::before,
.customer-main > .customer-game-card:nth-of-type(3) .customer-game-title::before{
  content:"🎲";
  font-size:23px;
}

.game-badge,
.daily-badge{
  min-width:70px;
  padding:8px 10px;
  border-radius:9px;
  border:1px solid rgba(255,200,30,.72);
  background:#0a0f16;
  color:#ffd43d;
  font-size:9px;
  font-weight:900;
  letter-spacing:.4px;
  text-align:center;
}

.game-badge{
  font-size:0;
}

.game-badge::after{
  content:"RULES";
  font-size:9px;
}

.daily-badge{
  font-size:0;
}

.daily-badge::after{
  content:"RULES";
  font-size:9px;
}

.main-market-grid,
.customer-main-grid,
.bazi-grid,
.customer-bazi-grid{
  gap:8px;
}

.main-market,
.customer-market{
  min-height:118px;
  padding:11px;
  border-radius:10px;
  background:linear-gradient(145deg,#0c1219,#05090e);
  border:1px solid #28323d;
  box-shadow:inset 0 0 15px rgba(255,255,255,.012);
}

.market-name,
.customer-market-top{
  color:#f3f3f3;
  font-size:15px;
  font-weight:900;
}

.deadline,
.customer-deadline{
  margin-top:7px;
  color:#b9bec6;
  font-size:11px;
}

.running-line,
.customer-running{
  margin-top:12px;
  color:#27ed82;
  font-size:12px;
  font-weight:900;
  text-align:center;
}

.public-locked-status,
.locked-status,
.customer-locked{
  margin-top:12px;
  color:#ff5555;
  font-size:11px;
  font-weight:900;
  text-align:center;
}

.green-dot{
  width:10px;
  height:10px;
  margin-right:6px;
  box-shadow:0 0 8px rgba(34,237,117,.45);
}

.result-line,
.customer-result-line{
  margin-top:10px;
  padding-top:8px;
  border-top:1px solid #2a333e;
  color:#b9bec6;
  font-size:10px;
  font-weight:800;
  text-align:center;
}

.result-value,
.customer-result-line strong{
  color:#fff;
  font-size:15px;
  font-weight:900;
}

.bazi-box,
.customer-bazi-box{
  min-height:92px;
  padding:10px;
  border-radius:9px;
  background:linear-gradient(145deg,#0b1118,#05090e);
  border:1px solid #28323d;
}

.bazi-name,
.customer-bazi-number{
  color:#f3f3f3;
  font-size:14px;
  font-weight:900;
}

.bazi-time,
.customer-bazi-time{
  color:#aeb5bf;
  font-size:10px;
}

.bazi-status,
.customer-bazi-status{
  margin-top:9px;
  color:#2bed82;
  font-size:11px;
  font-weight:900;
  text-align:center;
}

.bazi-status.locked-status{
  color:#ff5555;
}

.customer-bazi-action{
  margin-top:7px;
  padding-top:6px;
  border-top:1px solid #2a333e;
  color:#aeb5bf;
  font-size:9px;
  font-weight:800;
  text-align:center;
}
.customer-play-action{
  margin-top:7px;
  padding:8px 6px;
  border-top:none;
  border-radius:7px;
  background:linear-gradient(135deg,#ffe15c,#ffb915);
  color:#101010;
  font-size:9px;
  font-weight:900;
  text-align:center;
  box-shadow:0 4px 12px rgba(255,190,20,.12);
}

.play-btn{
  height:40px;
  margin-top:10px;
  border-radius:9px;
  background:linear-gradient(135deg,#ffe15c,#ffb915);
  color:#101010;
  font-size:13px;
  font-weight:900;
  box-shadow:0 4px 12px rgba(255,190,20,.12);
}

.footer,
.customer-footer{
  padding:19px 12px 24px;
  background:#030507;
  border-top:1px solid rgba(255,193,7,.22);
}

.footer-note{
  display:none;
}

.footer-title{
  display:none;
}

.footer-responsible{
  color:#d7d7d7;
  font-size:10px;
  font-weight:700;
  letter-spacing:.2px;
  text-align:center;
}

.footer-responsible:first-letter{
  color:#ffd43d;
}

.customer-header-actions{
  gap:6px;
}

.customer-refresh-btn,
.profile-mini-btn,
.customer-logout-btn{
  height:38px;
  border-radius:9px;
  border:1px solid rgba(255,199,32,.68);
  background:#090e15;
  color:#ffd33d;
  font-size:9px;
  font-weight:900;
}

.customer-refresh-btn{
  width:38px;
  padding:0;
  font-size:20px;
}

.profile-mini-btn{
  width:34px;
  min-width:34px;
  height:38px;
  padding:0;
  border-radius:50%;
  display:inline-flex;
  align-items:center;
  justify-content:center;
}

.customer-main{
  padding:12px 12px 25px;
}

.balance-wrap{
  gap:8px;
  margin-bottom:10px;
}

.balance-card{
  padding:9px 10px;
  border-radius:9px;
  background:linear-gradient(145deg,#17140b,#090c11);
  border:1px solid rgba(255,194,18,.42);
}

.balance-card.exposure{
  border-color:rgba(255,255,255,.15);
}

.balance-label{
  color:#aeb4bc;
  font-size:8px;
}

.balance-value{
  margin-top:3px;
  font-size:17px;
}

.balance-small{
  color:#737982;
  font-size:7px;
}

.customer-welcome{
  margin-bottom:10px;
  padding:15px 13px;
  border-radius:12px;
  background:
    linear-gradient(135deg,rgba(255,195,0,.12),transparent 28%,rgba(255,195,0,.04) 75%,rgba(255,195,0,.10));
  border:1px solid rgba(255,196,18,.50);
  text-align:center;
}

.customer-welcome-title{
  color:#f1f1f1;
  font-size:18px;
}

.customer-welcome-title::before{
  content:"♛ ";
  color:#ffd43d;
}

.customer-welcome-sub{
  color:#b6bbc3;
  font-size:10px;
  line-height:1.45;
}

.customer-live{
  padding:5px 8px;
  font-size:8px;
}

.customer-nav{
  grid-template-columns:repeat(3,1fr);
  gap:7px;
  margin-bottom:13px;
}

.customer-nav-btn{
  height:35px;
  border-radius:8px;
  border:1px solid #2b3440;
  background:#090e15;
  color:#b9bec6;
  font-size:9px;
}

.customer-nav-btn.active{
  color:#111;
  border-color:#ffc52a;
  background:linear-gradient(135deg,#ffe36a,#ffbd19);
}

.customer-notice{
  margin:12px 2px;
  color:#8e959e;
  font-size:8px;
}

@media (max-width:560px){
  .brand-crown{font-size:31px;}
  .brand,.customer-brand{font-size:22px;}
  .brand-subtitle,.customer-subtitle{font-size:8px;letter-spacing:1.3px;}
  .auth-btn{min-width:68px;height:38px;padding:0 11px;font-size:10px;}
  .support-btn{min-height:38px;font-size:11px;}
  .welcome > h1{font-size:18px;}
  .welcome p{font-size:10px;}
  .today-title,.customer-section-title{font-size:16px;gap:9px;}
  .today-title::before,.today-title::after,.customer-section-title::before,.customer-section-title::after{width:38px;}
  .game-title,.customer-game-title{font-size:18px;}
  .game-title::before,.customer-game-title::before{font-size:22px;}
  .main-market,.customer-market{min-height:108px;padding:9px;}
  .bazi-box,.customer-bazi-box{min-height:86px;padding:9px;}
  .customer-header-actions{gap:4px;}
  .profile-mini-btn{width:34px;min-width:34px;padding:0;font-size:16px;}
}

@media (max-width:390px){
  .amount-grid {
    gap: 7px;
  }

  .amount-btn {
    width: 50px;
    height: 50px;
    min-height: 50px;
    font-size: 9px;
  }
}

@media (max-width:390px){
  .header,.customer-header{padding:13px 9px 11px;}
  .brand-crown{font-size:27px;}
  .brand,.customer-brand{font-size:19px;}
  .brand-subtitle,.customer-subtitle{font-size:7px;}
  .auth-btn{min-width:60px;height:35px;font-size:9px;padding:0 8px;}
  .support-row{gap:6px;}
  .support-btn{min-height:35px;font-size:10px;}
  .games,.customer-main{padding-left:9px;padding-right:9px;}
  .game-card,.customer-game-card{padding:10px;}
  .game-title,.customer-game-title{font-size:16px;}
  .game-badge,.daily-badge{min-width:62px;padding:7px 7px;}
  .game-badge::after,.daily-badge::after{font-size:8px;}
  .market-name,.customer-market-top{font-size:13px;}
  .deadline,.customer-deadline{font-size:10px;}
  .bazi-name,.customer-bazi-number{font-size:12px;}
  .bazi-time,.customer-bazi-time{font-size:9px;}
}


/* =========================================================
   APNA MATKA SUPER ADMIN — PREMIUM CONTROL PANEL UI
   Visual-only layer. Existing functionality and calculations
   remain unchanged except for the explicitly requested card
   removal/text corrections above.
   ========================================================= */

.admin-shell{
  background:
    radial-gradient(circle at 8% 0%, rgba(255,205,55,.12), transparent 24%),
    radial-gradient(circle at 94% 14%, rgba(0,135,255,.06), transparent 22%),
    linear-gradient(135deg, rgba(255,193,7,.035) 0 1px, transparent 1px 58px),
    linear-gradient(315deg, rgba(255,193,7,.025) 0 1px, transparent 1px 72px),
    linear-gradient(180deg,#030507 0%,#070b11 48%,#020305 100%);
}

.admin-header{
  position:relative;
  padding:15px 14px 13px;
  border-bottom:1px solid rgba(255,195,0,.34);
  background:
    radial-gradient(circle at 10% 0%, rgba(255,193,7,.12), transparent 28%),
    linear-gradient(180deg,#0b0f15 0%,#05080d 100%);
  box-shadow:0 8px 30px rgba(0,0,0,.28);
}

.admin-brand{
  position:relative;
  padding-left:39px;
  font-size:21px;
  letter-spacing:1.4px;
  text-shadow:0 0 18px rgba(255,200,45,.16);
}

.admin-brand::before{
  content:"♛";
  position:absolute;
  left:0;
  top:50%;
  transform:translateY(-52%);
  width:31px;
  height:31px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:50%;
  color:#ffd33d;
  background:radial-gradient(circle,#2b210b 0%,#0c0e12 68%);
  border:1px solid rgba(255,205,55,.42);
  box-shadow:0 0 16px rgba(255,193,7,.12), inset 0 0 12px rgba(255,193,7,.08);
  font-size:20px;
}

.admin-subtitle{
  margin-top:5px;
  font-size:7px;
  letter-spacing:1.25px;
  color:#c2a84f;
}

.admin-header-actions{
  gap:7px;
}

.admin-role-badge,
.admin-logout-btn{
  min-height:34px;
  border-radius:9px;
}

.admin-role-badge{
  padding:0 10px;
  display:flex;
  align-items:center;
  border-color:rgba(255,205,55,.58);
  background:linear-gradient(145deg,#17150d,#0b0e13);
  box-shadow:inset 0 0 15px rgba(255,193,7,.04);
}

.admin-logout-btn{
  padding:0 11px;
  background:linear-gradient(145deg,#8e2029,#bd2933);
  box-shadow:0 5px 14px rgba(170,25,35,.18);
}

.admin-main{
  max-width:980px;
  padding:14px;
}

.admin-welcome-card,
.admin-panel-card,
.admin-supply-card{
  position:relative;
  overflow:hidden;
  border:1px solid rgba(255,198,40,.32);
  border-radius:15px;
  background:
    radial-gradient(circle at 88% 10%, rgba(255,193,7,.08), transparent 28%),
    linear-gradient(145deg,rgba(18,23,30,.98),rgba(5,8,13,.98));
  box-shadow:
    0 12px 30px rgba(0,0,0,.24),
    inset 0 0 28px rgba(255,193,7,.018);
}

.admin-welcome-card::before,
.admin-panel-card::before,
.admin-supply-card::before{
  content:"";
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  width:3px;
  background:linear-gradient(180deg,#ffe36a,#d99c00,transparent);
  opacity:.9;
}

.admin-welcome-card{
  min-height:104px;
  padding:18px 16px;
  border-color:rgba(255,198,40,.48);
}

.admin-welcome-card h1{
  font-size:22px;
  letter-spacing:-.3px;
}

.admin-welcome-card p{
  font-size:9px;
  color:#aeb4bd;
}

.admin-section-kicker{
  color:#d7b83e;
  font-size:7px;
  letter-spacing:1.5px;
}

.admin-refresh-btn,
.admin-small-action{
  min-height:34px;
  border-radius:9px;
  border:1px solid rgba(255,202,47,.58);
  background:linear-gradient(145deg,#17150d,#0b0e13);
  color:#ffd43d;
  box-shadow:inset 0 0 12px rgba(255,193,7,.035);
  transition:transform .15s ease, border-color .15s ease, box-shadow .15s ease;
}

.admin-refresh-btn{
  min-width:88px;
}

.admin-refresh-btn:hover,
.admin-small-action:hover{
  border-color:rgba(255,218,90,.9);
  box-shadow:0 0 16px rgba(255,193,7,.10), inset 0 0 12px rgba(255,193,7,.05);
}

.admin-refresh-btn:active,
.admin-small-action:active{
  transform:translateY(1px);
}

.admin-stat-grid{
  gap:9px;
  margin-bottom:12px;
}

.admin-stat-card{
  position:relative;
  overflow:hidden;
  min-height:92px;
  padding:13px;
  border-radius:13px;
  border:1px solid rgba(255,255,255,.10);
  background:
    radial-gradient(circle at 90% 0%, rgba(255,193,7,.08), transparent 34%),
    linear-gradient(145deg,#10151c,#070a0f);
  box-shadow:0 7px 22px rgba(0,0,0,.20), inset 0 0 20px rgba(255,255,255,.012);
}

.admin-stat-card::after{
  content:"";
  position:absolute;
  right:10px;
  bottom:9px;
  width:30px;
  height:30px;
  border-radius:50%;
  border:1px solid rgba(255,203,55,.12);
  box-shadow:0 0 18px rgba(255,193,7,.05);
}

.admin-stat-card:nth-child(1){border-color:rgba(255,195,0,.28);}
.admin-stat-card:nth-child(2){border-color:rgba(75,160,255,.24);}
.admin-stat-card:nth-child(3){border-color:rgba(0,220,120,.22);}
.admin-stat-card:nth-child(4){border-color:rgba(255,195,0,.34);}
.admin-stat-card:nth-child(5){border-color:rgba(255,80,95,.28);}

.admin-stat-card span{
  color:#858b95;
  font-size:6.5px;
  letter-spacing:1px;
}

.admin-stat-card strong{
  font-size:18px;
}

.admin-stat-card:last-child{
  grid-column:1 / -1;
}

.admin-module-grid{
  gap:9px;
  margin-bottom:12px;
}

.admin-home-modules{
  padding:14px;
  border:1px solid rgba(255,198,40,.24);
  border-radius:15px;
  background:linear-gradient(145deg,rgba(16,21,28,.94),rgba(6,9,13,.94));
  box-shadow:0 10px 26px rgba(0,0,0,.18), inset 0 0 24px rgba(255,193,7,.015);
}

.admin-home-modules::before{
  content:"QUICK ACCESS MODULES";
  grid-column:1 / -1;
  display:block;
  padding:1px 0 3px 10px;
  border-left:3px solid #ffd43d;
  color:#ffd43d;
  font-size:11px;
  font-weight:900;
  letter-spacing:.8px;
}

.admin-home-modules::after{
  content:"Manage your platform efficiently";
  grid-column:1 / -1;
  display:block;
  grid-row:2;
  margin-top:-7px;
  padding-left:13px;
  color:#737b86;
  font-size:7px;
}

.admin-home-modules .admin-module-card{
  grid-row:auto;
}

.admin-module-card{
  position:relative;
  min-height:76px;
  padding:13px 40px 13px 13px;
  overflow:hidden;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.10);
  background:
    radial-gradient(circle at 96% 0%, rgba(255,193,7,.08), transparent 32%),
    linear-gradient(145deg,#11161d,#080b10);
  box-shadow:0 7px 18px rgba(0,0,0,.18), inset 0 0 18px rgba(255,193,7,.012);
  transition:transform .15s ease, border-color .15s ease, box-shadow .15s ease;
}

.admin-module-card::after{
  content:"›";
  position:absolute;
  right:11px;
  top:50%;
  transform:translateY(-50%);
  width:26px;
  height:26px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:50%;
  border:1px solid rgba(255,205,55,.68);
  color:#ffd43d;
  background:#0b0d12;
  font-size:20px;
  line-height:1;
}

.admin-module-card:hover{
  transform:translateY(-1px);
  border-color:rgba(255,205,55,.42);
  box-shadow:0 10px 22px rgba(0,0,0,.25), 0 0 16px rgba(255,193,7,.05);
}

.admin-module-card.active{
  border-color:rgba(255,205,55,.66);
  background:
    radial-gradient(circle at 96% 0%, rgba(255,193,7,.12), transparent 34%),
    linear-gradient(145deg,#17150d,#090c11);
}

.admin-module-card b{
  font-size:10px;
  color:#f5d04d;
}

.admin-module-card small{
  color:#8d949e;
  font-size:7.5px;
  line-height:1.45;
}

.admin-supply-card{
  min-height:110px;
  padding:17px;
  border-color:rgba(255,198,40,.42);
  background:
    radial-gradient(circle at 90% 50%, rgba(255,193,7,.12), transparent 28%),
    linear-gradient(145deg,#11140f,#06090d);
}

.admin-supply-card::after{
  content:"◎";
  position:absolute;
  right:20px;
  top:50%;
  transform:translateY(-50%);
  color:#ffd43d;
  font-size:54px;
  opacity:.10;
}

.admin-supply-card h2{
  font-size:21px;
}

.admin-supply-card p{
  font-size:8.5px;
  max-width:760px;
}

.admin-panel-card{
  padding:17px;
  margin-bottom:12px;
}

.admin-panel-title{
  font-size:11px;
  letter-spacing:.4px;
  color:#ffd43d;
}

.admin-panel-title-row{
  padding-bottom:10px;
  border-bottom:1px solid rgba(255,195,0,.10);
}

.admin-account-detail-panel{
  padding:17px;
}

.admin-account-detail-intro{
  color:#929aa5;
  font-size:8.5px;
}

.admin-account-grid-detail{
  gap:9px;
}

.admin-account-card{
  position:relative;
  overflow:hidden;
  min-height:92px;
  padding:13px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.10);
  background:
    radial-gradient(circle at 100% 0%, rgba(255,193,7,.07), transparent 36%),
    linear-gradient(145deg,#10151c,#070a0f);
  box-shadow:0 7px 18px rgba(0,0,0,.18), inset 0 0 18px rgba(255,255,255,.01);
}

.admin-account-card::after{
  content:"";
  position:absolute;
  right:10px;
  top:10px;
  width:24px;
  height:24px;
  border-radius:50%;
  border:1px solid rgba(255,205,55,.12);
}

.admin-account-card.primary{
  border-color:rgba(255,198,40,.58);
  background:
    radial-gradient(circle at 92% 8%, rgba(255,193,7,.13), transparent 38%),
    linear-gradient(145deg,#17150d,#090c11);
}

.admin-account-card.highlight{
  border-color:rgba(255,198,40,.34);
}

.admin-account-card span{
  font-size:6.5px;
  letter-spacing:1px;
  color:#858b95;
}

.admin-account-card strong{
  font-size:17px;
}

.admin-account-card small{
  font-size:7px;
  color:#737b86;
}

.admin-account-grid-detail .admin-account-card:last-child{
  grid-column:1 / -1;
}

.profile-change-password-panel{
  margin:10px 0;
  padding:12px;
  border:1px solid rgba(255,255,255,.08);
  border-radius:10px;
  background:linear-gradient(145deg,#0d1219,#080b10);
}
.profile-change-password-title{font-size:10px;letter-spacing:1px;margin-bottom:10px;}
.profile-change-password-btn{
  width:100%;
  display:flex;
  justify-content:space-between;
  align-items:center;
  background:transparent;
  border:0;
  color:inherit;
  padding:14px 0;
}

.admin-form{
  gap:11px;
}

.admin-form-field label{
  color:#858c96;
  font-size:7px;
}

.admin-form-input{
  height:43px;
  border-radius:9px;
  border-color:#252d38;
  background:linear-gradient(145deg,#090d13,#06090d);
  box-shadow:inset 0 0 14px rgba(0,0,0,.25);
}

.admin-form-input:focus{
  border-color:rgba(255,205,55,.72);
  box-shadow:0 0 0 2px rgba(255,193,7,.06), inset 0 0 14px rgba(255,193,7,.025);
}

.admin-form-note{
  border:1px solid rgba(255,255,255,.07);
  background:linear-gradient(145deg,#0c1118,#080b10);
  color:#858c96;
}

.admin-create-btn{
  height:43px;
  border-radius:9px;
  background:linear-gradient(135deg,#ffe36a,#ffba18);
  color:#111;
  border-color:#ffd43d;
  box-shadow:0 7px 18px rgba(255,190,20,.10);
}

.admin-empty{
  border:1px solid rgba(255,255,255,.07);
  background:linear-gradient(145deg,#0c1118,#080b10);
  color:#7d858f;
}

.admin-agent-row,
.admin-wallet-result-row{
  padding:11px;
  border-radius:10px;
  border-color:rgba(255,255,255,.09);
  background:linear-gradient(145deg,#0d1219,#080b10);
}

.admin-agent-row b,
.admin-wallet-result-row b{
  font-size:9px;
}

.admin-status{
  border:1px solid rgba(255,75,85,.22);
}

.admin-status.active{
  border:1px solid rgba(70,235,140,.22);
}

.reports-table-scroll{
  border-color:rgba(255,198,40,.18);
  background:#06090d;
  box-shadow:inset 0 0 22px rgba(255,193,7,.018);
}

.reports-table th{
  background:linear-gradient(180deg,#1a160d,#100f0c);
  color:#ffd43d;
}

.reports-table td{
  background:rgba(7,10,15,.88);
}

.admin-pagination{
  padding-top:2px;
}

@media (max-width:560px){
  .admin-header{
    padding:14px 10px 12px;
  }

  .admin-brand{
    font-size:20px;
    padding-left:36px;
  }

  .admin-brand::before{
    width:29px;
    height:29px;
    font-size:18px;
  }

  .admin-main{
    padding:12px 10px 24px;
  }

  .admin-welcome-card{
    padding:16px 13px;
  }

  .admin-welcome-card h1{
    font-size:20px;
  }

  .admin-module-card{
    min-height:72px;
  }
}

@media (max-width:390px){
  .admin-brand{
    font-size:18px;
    padding-left:33px;
  }

  .admin-brand::before{
    width:27px;
    height:27px;
    font-size:17px;
  }

  .admin-role-badge{
    padding:0 8px;
  }

  .admin-logout-btn{
    padding:0 9px;
  }

  .admin-main{
    padding-left:8px;
    padding-right:8px;
  }
}

/* =========================================================
   GAME SELECTOR / NAVIGATION UI
========================================================= */

.public-game-selector-grid,
.customer-game-selector-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:10px;
  margin-bottom:12px;
}

.public-game-selector,
.customer-game-selector{
  width:100%;
  min-height:142px;
  padding:12px;
  border-radius:13px;
  border:1px solid rgba(255,194,18,.45);
  background:linear-gradient(145deg,#111820,#070b10);
  color:#f4f4f4;
  text-align:left;
  cursor:pointer;
  box-shadow:inset 0 0 18px rgba(255,193,7,.025);
  transition:transform .15s ease,border-color .15s ease,box-shadow .15s ease;
}

.public-game-selector:hover,
.customer-game-selector:hover{
  transform:translateY(-1px);
  border-color:rgba(255,211,61,.78);
}

.public-game-selector.selected,
.customer-game-selector.selected{
  border-color:#f4c83e;
  box-shadow:0 0 0 1px rgba(244,200,62,.16),inset 0 0 24px rgba(255,193,7,.06);
}

.public-game-selector-top,
.customer-game-selector-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:7px;
  margin-bottom:10px;
}

.public-game-selector-icon,
.customer-game-selector-icon{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:34px;
  height:34px;
  flex:0 0 34px;
  border-radius:9px;
  background:#0a0f16;
  border:1px solid rgba(255,200,30,.35);
  color:#ffd43d;
  font-size:21px;
}

.public-game-selector strong,
.customer-game-selector strong{
  display:block;
  color:#f4c83e;
  font-size:15px;
  line-height:1.2;
  font-weight:900;
}

.public-game-selector > span:not(.public-game-selector-status),
.customer-game-selector > span:not(.customer-game-selector-status){
  display:block;
  margin-top:6px;
  color:#c5cad1;
  font-size:10px;
}

.public-game-selector small,
.customer-game-selector small{
  display:block;
  margin-top:8px;
  color:#8f98a4;
  font-size:10px;
  line-height:1.35;
}

.public-game-selector-status,
.customer-game-selector-status{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:25px;
  padding:0 7px;
  border-radius:7px;
  border:1px solid #303944;
  background:#090e14;
  font-size:8px;
  font-weight:900;
  letter-spacing:.2px;
  text-align:center;
}

.public-game-selector-status.open,
.customer-game-selector-status.open{
  color:#27ed82;
  border-color:rgba(39,237,130,.45);
}

.public-game-selector-status.locked,
.customer-game-selector-status.locked{
  color:#ffd43d;
  border-color:rgba(255,212,61,.4);
}

.public-game-selector-status.off,
.customer-game-selector-status.off{
  color:#ff6b6b;
  border-color:rgba(255,91,91,.4);
}

.public-selected-game-card,
.customer-selected-game-card{
  margin-bottom:14px;
  padding:13px;
  border-radius:13px;
  border:1px solid rgba(255,194,18,.46);
  background:linear-gradient(145deg,rgba(17,23,30,.98),rgba(5,9,14,.98));
  box-shadow:0 7px 24px rgba(0,0,0,.25),inset 0 0 22px rgba(255,193,7,.025);
}

.public-selected-game-head,
.customer-selected-game-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:12px;
}

.public-selected-game-head h2,
.customer-selected-game-head h2{
  margin:0;
  color:#f4c83e;
  font-size:20px;
  font-weight:900;
}

.public-selected-game-head p,
.customer-selected-game-head p{
  margin:5px 0 0;
  color:#aeb5bf;
  font-size:10px;
}

.public-selected-game-head .today-title{
  justify-content:flex-start;
  margin:0 0 6px;
  font-size:9px;
  letter-spacing:1px;
}

.public-selected-game-head .today-title::before,
.public-selected-game-head .today-title::after{
  display:none;
}

.public-back-games{
  min-height:36px;
  padding:0 10px;
  border-radius:8px;
  border:1px solid #34404d;
  background:#0b1118;
  color:#f4c83e;
  font-size:9px;
  font-weight:900;
}

.public-session-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:8px;
}

.public-session-card{
  min-height:112px;
  padding:11px;
  border-radius:10px;
  border:1px solid #28323d;
  background:linear-gradient(145deg,#0c1219,#05090e);
}

.public-session-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
}

.public-session-top strong{
  color:#f3f3f3;
  font-size:14px;
}

.public-session-top span{
  color:#aeb5bf;
  font-size:10px;
}

.public-session-status{
  margin-top:10px;
  min-height:30px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  border-radius:7px;
  font-size:10px;
  font-weight:900;
}

.public-session-status.open{
  color:#27ed82;
  background:rgba(39,237,130,.07);
}

.public-session-status.locked{
  color:#ffd43d;
  background:rgba(255,212,61,.06);
}

.public-session-status.off{
  color:#ff7070;
  background:rgba(255,91,91,.06);
}

.customer-header-balances{
  display:flex;
  align-items:center;
  gap:7px;
  margin-left:auto;
}

.customer-header-balances > div{
  min-width:76px;
  padding:5px 7px;
  border-radius:7px;
  background:#0a0f15;
  border:1px solid #25303b;
  text-align:right;
}

.customer-header-balances span{
  display:block;
  color:#8d96a1;
  font-size:7px;
  font-weight:900;
  letter-spacing:.4px;
}

.customer-header-balances strong{
  display:block;
  margin-top:2px;
  color:#27ed82;
  font-size:10px;
  font-weight:900;
}

.customer-header-balances > div:last-child strong{
  color:#ff6464;
}

@media (max-width:760px){
  .public-game-selector-grid,
  .customer-game-selector-grid{
    grid-template-columns:1fr;
  }

  .public-game-selector,
  .customer-game-selector{
    min-height:112px;
  }

  .public-session-grid{
    grid-template-columns:1fr;
  }

  .public-selected-game-head,
  .customer-selected-game-head{
    align-items:flex-start;
  }

  .customer-header-balances{
    order:2;
    width:100%;
    margin-left:0;
  }

  .customer-header-balances > div{
    flex:1;
    text-align:center;
  }
}



/* =========================================================
   CONFIRMED GAME SESSION PLACEMENT + CUSTOMER HEADER
   ========================================================= */
.public-game-selector-grid > .public-selected-game-card,
.customer-game-selector-grid > .customer-selected-game-card{
  grid-column:1 / -1;
}

.customer-header-inner{
  min-width:0;
}
.customer-header .brand-lockup{
  min-width:0;
  flex:1 1 auto;
}
.customer-header .brand-lockup > div{
  min-width:0;
}
.customer-header .customer-brand{
  white-space:nowrap;
}
.customer-header-balances{
  flex:0 0 auto;
  gap:4px;
}
.customer-header-balances > div{
  min-width:62px;
  padding:4px 5px;
  flex:0 0 auto;
}
.customer-header-balances span{
  font-size:6px;
}
.customer-header-balances strong{
  font-size:9px;
}
.customer-header-actions{
  flex:0 0 auto;
  gap:4px;
}
.customer-header .customer-refresh-btn,
.customer-header .profile-mini-btn{
  width:34px;
  min-width:34px;
  height:34px;
  padding:0;
  display:inline-flex;
  align-items:center;
  justify-content:center;
}
.customer-header .customer-refresh-btn{
  font-size:18px;
}
.customer-header .profile-mini-btn{
  font-size:16px;
}

@media (max-width:760px){
  .customer-header-balances{
    order:initial;
    width:auto;
    margin-left:auto;
  }
  .customer-header-balances > div{
    flex:0 0 auto;
  }
}

@media (max-width:560px){
  .customer-header-inner{
    gap:4px;
  }
  .customer-header .brand-crown{
    font-size:27px;
  }
  .customer-header .customer-brand{
    font-size:18px;
    letter-spacing:.6px;
  }
  .customer-header .customer-subtitle{
    font-size:6px;
    letter-spacing:1px;
  }
  .customer-header-balances{
    gap:3px;
  }
  .customer-header-balances > div{
    min-width:60px;
    padding:5px 5px;
  }
  .customer-header-balances strong{
    font-size:9.5px;
  }
}

@media (max-width:390px){
  .customer-header .brand-crown{
    font-size:24px;
  }
  .customer-header .customer-brand{
    font-size:16px;
  }
  .customer-header .customer-subtitle{
    font-size:5px;
  }
  .customer-header-balances > div{
    min-width:56px;
  }
  .customer-header-balances strong{
    font-size:9px;
  }
  .customer-header .customer-refresh-btn,
  .customer-header .profile-mini-btn{
    width:31px;
    min-width:31px;
    height:31px;
  }
}


/* ================= BETTING REFERENCE VISUAL PATCH ================= */

.context-game-row{
  display:flex;
  align-items:center;
  gap:8px;
}
.context-game-icon{
  width:34px;
  height:34px;
  flex:0 0 34px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  border-radius:9px;
  border:1px solid rgba(255,200,30,.42);
  background:linear-gradient(145deg,#121820,#070b10);
  color:#ffd43d;
  font-size:21px;
  line-height:1;
  text-shadow:0 0 10px rgba(255,193,7,.24);
}
.context-game-row .context-value{
  flex:1 1 auto;
  min-width:0;
}

/* Gold, readable betting numbers */
.number-btn:not(.selected) span{
  color:#f0cf58;
  font-size:10px;
  font-weight:900;
  letter-spacing:.2px;
  text-shadow:0 1px 3px rgba(255,193,7,.16);
}
.bet-type-reference-number{
  color:#f2cf55;
  text-shadow:0 1px 3px rgba(255,193,7,.16);
}
.bet-type-btn.selected .bet-type-reference-number{
  color:#17120a;
  text-shadow:none;
}

/* Premium 3D gold betting coins */
.amount-btn{
  width:58px;
  height:58px;
  min-height:58px;
  border:3px solid #d99b16;
  border-radius:50%;
  background:
    radial-gradient(circle at 34% 28%,#fff4a8 0%,#f6c52f 18%,#9c6510 47%,#3b2507 66%,#090b10 72%),
    #0b0e14;
  color:#ffe06a;
  font-size:10px;
  font-weight:900;
  text-shadow:0 1px 2px #2a1a02;
  box-shadow:
    inset 0 0 0 2px rgba(255,235,125,.62),
    inset 0 -4px 5px rgba(0,0,0,.55),
    0 3px 0 #6f4508,
    0 7px 14px rgba(0,0,0,.42);
}
.amount-btn.selected{
  color:#fff9cf;
  border-color:#ffe36a;
  background:
    radial-gradient(circle at 34% 27%,#fffbe0 0%,#ffe85a 20%,#ffbf16 48%,#a96b09 72%,#3b2304 100%);
  box-shadow:
    inset 0 0 0 2px rgba(255,250,190,.92),
    inset 0 -4px 5px rgba(92,51,0,.42),
    0 0 0 2px rgba(255,198,35,.24),
    0 0 20px rgba(255,190,20,.48),
    0 7px 15px rgba(0,0,0,.45);
}

/* Reference-style bottom navigation */
.customer-bottom-nav{
  margin-top:14px;
  padding:5px;
  gap:5px;
  border:1px solid rgba(255,193,7,.24);
  border-radius:11px;
  background:linear-gradient(180deg,#070b11,#05080d);
  box-shadow:0 -4px 18px rgba(0,0,0,.24),inset 0 0 18px rgba(255,193,7,.025);
}
.customer-bottom-nav button{
  height:58px;
  min-width:0;
  border-radius:9px;
  border:1px solid #202a35;
  background:linear-gradient(145deg,#0b1118,#070b10);
  color:#d8dce1;
  font-size:9px;
  font-weight:800;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:4px;
}
.customer-bottom-nav button::before{
  display:block;
  font-size:17px;
  line-height:1;
  color:#e7ebf0;
}
.customer-bottom-nav button:nth-child(1)::before{content:"⌂";}
.customer-bottom-nav button:nth-child(2)::before{content:"◷";}
.customer-bottom-nav button:nth-child(3)::before{
  content:"";
  width:18px;
  height:18px;
  background:
    radial-gradient(circle at 50% 28%,currentColor 0 4px,transparent 4.5px),
    radial-gradient(ellipse at 50% 88%,currentColor 0 8px,transparent 8.5px);
}
.customer-bottom-nav .selected-bottom{
  color:#17120a;
  border-color:#ffc52a;
  background:linear-gradient(145deg,#ffe76b,#ffbd19);
  box-shadow:0 0 14px rgba(255,193,7,.18),inset 0 0 12px rgba(255,255,255,.18);
}
.customer-bottom-nav .selected-bottom::before{color:#17120a;}

@media (max-width:390px){
  .amount-btn{width:54px;height:54px;min-height:54px;}
  .customer-bottom-nav button{height:56px;}
}


/* =========================================================
   CONFIRMED CUSTOMER FIXED HEADER / BOTTOM NAV + FINAL BETTING UI
   Minimal visual-only patch. Existing logic and markup preserved.
   ========================================================= */
.customer-header{
  position:fixed !important;
  top:0 !important;
  left:0 !important;
  right:0 !important;
  z-index:1000 !important;
}
.customer-main{
  padding-top:118px !important;
  padding-bottom:86px !important;
}
.customer-bottom-nav{
  position:fixed !important;
  left:50% !important;
  right:auto !important;
  bottom:8px !important;
  transform:translateX(-50%) !important;
  width:min(calc(100% - 20px), 520px) !important;
  margin:0 !important;
  z-index:1001 !important;
}
.customer-footer{
  display:none !important;
}
.customer-notice{
  font-size:0 !important;
  margin:12px 2px 0 !important;
  padding:0 !important;
  background:transparent !important;
  border:none !important;
}
.customer-notice-responsible{
  display:block;
  color:#d7d7d7;
  font-size:10px;
  font-weight:700;
  letter-spacing:.2px;
  line-height:1.4;
  text-align:center;
}
.customer-notice-responsible:first-letter{
  color:#ffd43d;
}
.virtual-note{
  display:none !important;
}
.amount-btn,
.amount-btn.selected{
  color:#111 !important;
}
.number-btn span{
  font-size:11px !important;
}
@media (max-width:390px){
  .number-btn span{
    font-size:11px !important;
  }
}

/* =========================================================
   AUDIT MODULE — COMPACT PREMIUM / WHITE DETAIL AREA
   ========================================================= */
.audit-module-card{
  display:grid;
  grid-template-columns:42px minmax(0,1fr) 28px;
  align-items:center;
  gap:10px;
  min-height:82px;
  padding:12px;
  border:1px solid rgba(255,198,40,.22);
  border-radius:11px;
  background:linear-gradient(145deg,#12171e,#090c11);
  color:#fff;
  text-align:left;
  cursor:pointer;
}
.audit-module-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:9px;
}
.audit-module-card:hover{border-color:rgba(255,211,59,.58);}
.audit-module-icon{
  width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;
  border:1px solid rgba(255,205,55,.35);background:#17140b;color:#ffd43d;font-size:17px;font-weight:900;
}
.audit-module-card b{display:block;color:#ffd43d;font-size:10px;letter-spacing:.4px;}
.audit-module-card small{display:block;margin-top:4px;color:#8f96a0;font-size:7.5px;line-height:1.45;}
.audit-module-card strong{width:25px;height:25px;border:1px solid rgba(255,205,55,.38);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#ffd43d;font-size:18px;}
.audit-detail-shell{background:#fff;border:1px solid #dfe3e8;border-radius:10px;overflow:hidden;color:#111;}
.audit-detail-header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 12px;border-bottom:1px solid #e5e7eb;background:#fff;}
.audit-detail-header b{display:block;color:#111;font-size:10px;letter-spacing:.35px;}
.audit-detail-header small{display:block;margin-top:3px;color:#68707a;font-size:7px;line-height:1.45;}
.audit-white-scroll{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
.audit-white-table{width:100%;min-width:760px;border-collapse:collapse;table-layout:auto;font-size:9px;background:#fff;}
.audit-white-table th,.audit-white-table td{padding:8px 9px;border-bottom:1px solid #e8eaed;text-align:left;vertical-align:middle;white-space:nowrap;}
.audit-white-table th{background:#f5f6f8;color:#3d434a;font-size:7px;font-weight:900;letter-spacing:.04em;}
.audit-white-table td{color:#252a30;font-weight:600;}
.audit-white-table tr:last-child td{border-bottom:0;}
.audit-transaction-table th:nth-child(1){min-width:145px;}
.audit-transaction-table th:nth-child(2){min-width:150px;}
.audit-transaction-table th:nth-child(3){min-width:105px;}
.audit-transaction-table th:nth-child(4){min-width:105px;}
.audit-transaction-table th:nth-child(5){min-width:180px;}
.audit-settlement-table{min-width:880px;}
.audit-settlement-table th:nth-child(1){min-width:145px;}
.audit-settlement-table th:nth-child(2){min-width:125px;}
.audit-settlement-table th:nth-child(3){min-width:70px;}
.audit-settlement-table th:nth-child(4){min-width:105px;}
.audit-settlement-table th:nth-child(5){min-width:135px;}
.audit-settlement-table th:nth-child(6){min-width:115px;}
.audit-settlement-table th:nth-child(7){min-width:190px;}
.audit-counterparty-name{display:block;color:#111;font-size:9px;}
.audit-counterparty-type{display:inline-block;margin-top:3px;padding:2px 5px;border-radius:4px;font-size:6px;font-weight:900;letter-spacing:.3px;}
.audit-counterparty-type.agent{background:#f1edff;color:#6045a8;border:1px solid #ddd4fb;}
.audit-counterparty-type.online{background:#e9fbfd;color:#087989;border:1px solid #c6eef2;}
.audit-direction{display:inline-block;padding:3px 6px;border-radius:5px;font-size:7px;font-weight:900;}
.audit-direction.given{color:#9f2222;background:#fff0f0;border:1px solid #f3caca;}
.audit-direction.received{color:#13733b;background:#effaf3;border:1px solid #c9ecd8;}
.audit-amount-cell,.audit-after-cell{font-variant-numeric:tabular-nums;font-weight:800 !important;}
.audit-after-cell{color:#15191e !important;}
.audit-bazi-badge{display:inline-block;padding:3px 6px;border-radius:5px;background:#f6f7f9;border:1px solid #e0e3e7;color:#3c434a;font-size:7px;font-weight:900;}
.audit-game-cell{font-weight:800 !important;color:#111 !important;}
.audit-result-cell{font-weight:800 !important;color:#111 !important;}
.audit-network-positive{color:#12853f !important;font-weight:900 !important;}
.audit-network-negative{color:#c62929 !important;font-weight:900 !important;}
.audit-network-neutral{color:#4b525a !important;font-weight:800 !important;}
.audit-empty{padding:18px;text-align:center;background:#fff;color:#68707a;font-size:8px;}
.audit-pagination{display:flex;align-items:center;justify-content:center;gap:8px;padding:9px;background:#fff;border-top:1px solid #e5e7eb;}
.audit-pagination span{color:#626a73;font-size:7px;font-weight:900;}
.audit-page-btn{height:29px;padding:0 9px;border:1px solid #d3d7dc;border-radius:6px;background:#fff;color:#30363d;font-size:7px;font-weight:900;cursor:pointer;}
.audit-page-btn:disabled{opacity:.45;cursor:not-allowed;}
@media(max-width:560px){
  .audit-module-grid{grid-template-columns:1fr;}
  .audit-detail-header{align-items:flex-start;}
  .audit-detail-header .admin-small-action{flex:0 0 auto;}
  .audit-white-table{
    width:100%;
    min-width:0;
    table-layout:fixed;
    font-size:8px;
  }
  .audit-white-table th,
  .audit-white-table td{
    padding:7px 5px;
    white-space:normal;
    overflow-wrap:anywhere;
  }
  .audit-white-scroll{
    overflow-x:hidden;
  }
  .audit-date-time-cell{
    white-space:normal !important;
    line-height:1.25;
    font-variant-numeric:tabular-nums;
  }
  .audit-date-time-cell span{
    display:block;
  }
  .audit-counterparty-name{
    font-size:8px;
    line-height:1.2;
    overflow-wrap:anywhere;
  }
  .audit-counterparty-type{
    max-width:100%;
    margin-top:3px;
    font-size:5.5px;
    padding:2px 4px;
  }
  .audit-direction{
    font-size:6.5px;
    padding:3px 5px;
  }
  .audit-transaction-table th:nth-child(1){width:20%;}
  .audit-transaction-table th:nth-child(2){width:23%;}
  .audit-transaction-table th:nth-child(3){width:16%;}
  .audit-transaction-table th:nth-child(4){width:16%;}
  .audit-transaction-table th:nth-child(5){width:25%;}
  .audit-settlement-table th:nth-child(1){width:17%;}
  .audit-settlement-table th:nth-child(2){width:13%;}
  .audit-settlement-table th:nth-child(3){width:11%;}
  .audit-settlement-table th:nth-child(4){width:13%;}
  .audit-settlement-table th:nth-child(5){width:16%;}
  .audit-settlement-table th:nth-child(6){width:14%;}
  .audit-settlement-table th:nth-child(7){width:16%;}
  .audit-settlement-table .audit-bazi-badge{
    padding:3px 4px;
    font-size:6px;
  }
  .audit-game-cell,
  .audit-result-cell,
  .audit-amount-cell,
  .audit-after-cell{
    font-size:7.5px;
    overflow-wrap:anywhere;
  }
}



/* =========================================================
   CUSTOMER HISTORY + STATEMENT — CONFIRMED MOBILE AUDIT UI
   ========================================================= */
.customer-history-page .history-table-scroll,
.customer-statement-page .statement-table-scroll{
  width:100%;
  overflow-x:hidden;
  -webkit-overflow-scrolling:touch;
  border:1px solid #d7dbe0;
  border-radius:9px;
  background:#fff;
}

.customer-history-page .history-table,
.customer-statement-page .statement-table{
  width:100%;
  min-width:0;
  table-layout:fixed;
  border-collapse:collapse;
  background:#fff;
  color:#111827;
}

.customer-history-page .history-table th,
.customer-history-page .history-table td,
.customer-statement-page .statement-table th,
.customer-statement-page .statement-table td{
  border-bottom:1px solid #e1e5e9;
  overflow-wrap:anywhere;
}

.customer-history-page .history-table th,
.customer-statement-page .statement-table th{
  padding:8px 4px;
  background:#f2f4f6;
  color:#111827;
  font-size:7px;
  font-weight:900;
  line-height:1.25;
  white-space:normal;
}

.customer-history-page .history-table td,
.customer-statement-page .statement-table td{
  padding:8px 4px;
  background:#fff;
  color:#111827;
  font-size:7px;
  font-weight:700;
  line-height:1.35;
  white-space:normal;
}

.customer-history-page .history-table th:nth-child(1),
.customer-history-page .history-table td:nth-child(1){width:14%;}
.customer-history-page .history-table th:nth-child(2),
.customer-history-page .history-table td:nth-child(2){width:10%;}
.customer-history-page .history-table th:nth-child(3),
.customer-history-page .history-table td:nth-child(3){width:14%;}
.customer-history-page .history-table th:nth-child(4),
.customer-history-page .history-table td:nth-child(4){width:6%;}
.customer-history-page .history-table th:nth-child(5),
.customer-history-page .history-table td:nth-child(5){width:10%;}
.customer-history-page .history-table th:nth-child(6),
.customer-history-page .history-table td:nth-child(6){width:13%;}
.customer-history-page .history-table th:nth-child(7),
.customer-history-page .history-table td:nth-child(7){width:8%;}
.customer-history-page .history-table th:nth-child(8),
.customer-history-page .history-table td:nth-child(8){width:6%;}
.customer-history-page .history-table th:nth-child(9),
.customer-history-page .history-table td:nth-child(9){width:7%;}
.customer-history-page .history-table th:nth-child(10),
.customer-history-page .history-table td:nth-child(10){width:6%;}
.customer-history-page .history-table th:nth-child(11),
.customer-history-page .history-table td:nth-child(11){width:6%;}

.customer-history-page .history-table-datetime{
  color:#111827 !important;
  font-weight:800 !important;
  white-space:normal !important;
}
.customer-history-page .history-table-game,
.customer-history-page .history-table-bet-type{
  color:#8a6700 !important;
  font-weight:900 !important;
}
.customer-history-page .history-table-session,
.customer-history-page .history-table-bazi,
.customer-history-page .history-table-result{
  color:#111827 !important;
}
.customer-history-page .history-table-number,
.customer-history-page .history-table-amount,
.customer-history-page .history-table-rate{
  color:#7a5b00 !important;
  font-weight:900 !important;
}
.customer-history-page .history-table-won-amount{
  color:#16834b !important;
  font-weight:900 !important;
}
.customer-history-page .history-table-status{
  padding:3px 4px;
  border-radius:8px;
  font-size:6px;
  font-weight:900;
  white-space:nowrap;
}
.customer-history-page .history-table-status-pending{
  background:#fff7d6;
  border:1px solid #ead37b;
  color:#8a6800;
}
.customer-history-page .history-table-status-won{
  background:#e8f8ef;
  border:1px solid #a9dfbf;
  color:#16834b;
}
.customer-history-page .history-table-status-loss,
.customer-history-page .history-table-status-lost{
  background:#fdecec;
  border:1px solid #efb5b5;
  color:#c62828;
}

.customer-statement-page .statement-table th:nth-child(1),
.customer-statement-page .statement-table td:nth-child(1){width:24%;}
.customer-statement-page .statement-table th:nth-child(2),
.customer-statement-page .statement-table td:nth-child(2){width:20%;}
.customer-statement-page .statement-table th:nth-child(3),
.customer-statement-page .statement-table td:nth-child(3){width:16%;}
.customer-statement-page .statement-table th:nth-child(4),
.customer-statement-page .statement-table td:nth-child(4){width:20%;}
.customer-statement-page .statement-table th:nth-child(5),
.customer-statement-page .statement-table td:nth-child(5){width:20%;}
.customer-statement-page .statement-table-datetime{
  width:auto;
  text-align:left !important;
  color:#111827 !important;
  font-weight:800 !important;
  white-space:normal !important;
}
.customer-statement-page .statement-table-by{
  color:#111827 !important;
  font-weight:900 !important;
}
.customer-statement-page .statement-table-type-cell{
  width:auto;
  text-align:center !important;
}
.customer-statement-page .statement-table-type.credit,
.customer-statement-page .statement-table-credit{
  color:#16834b !important;
  font-weight:900 !important;
}
.customer-statement-page .statement-table-type.debit,
.customer-statement-page .statement-table-debit{
  color:#c62828 !important;
  font-weight:900 !important;
}
.customer-statement-page .statement-table-amount,
.customer-statement-page .statement-table-balance{
  width:auto;
  text-align:right !important;
}
.customer-statement-page .statement-table-balance{
  color:#111827 !important;
  font-weight:800 !important;
}
.customer-statement-page .statement-pagination-info,
.customer-statement-page .statement-pagination-page,
.customer-history-page .history-pagination-info,
.customer-history-page .history-pagination-page{
  color:#d7dde5;
}

@media (max-width:390px){
  .customer-history-page .history-table th,
  .customer-history-page .history-table td{
    padding:7px 3px;
    font-size:6.5px;
  }
  .customer-history-page .history-table-status{font-size:5.5px;padding:3px 3px;}
  .customer-statement-page .statement-table th,
  .customer-statement-page .statement-table td{
    padding:8px 4px;
    font-size:7px;
  }
}



/* =========================================================
   CUSTOMER BETTING INTERFACE — CONFIRMED REFERENCE VISUAL
   Frontend-only visual/interaction patch.
   Existing bet data, rates, selection logic, wallet, exposure,
   submission, session locking and settlement are untouched.
   ========================================================= */

.betting-context{
  border:1px solid rgba(255,201,35,.78);
  box-shadow:0 0 0 1px rgba(255,193,7,.06), inset 0 0 16px rgba(255,193,7,.025);
}

.betting-section-title{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  margin:14px 0 7px;
  color:#f0f0f0;
  font-size:9px;
  font-weight:900;
  letter-spacing:.45px;
  text-align:center;
}
.betting-section-title::before,
.betting-section-title::after{
  content:"";
  flex:1 1 0;
  max-width:72px;
  height:3px;
  border-radius:999px;
  background:linear-gradient(90deg,transparent,#f5c52d,#f5c52d);
}
.betting-section-title::after{
  background:linear-gradient(90deg,#f5c52d,#f5c52d,transparent);
}

.bet-type-btn{
  min-height:46px;
  border:1px solid rgba(255,193,7,.72);
  background:linear-gradient(145deg,#0b1118,#070b10);
  color:#f0f0f0;
  box-shadow:inset 0 0 12px rgba(255,193,7,.018);
}
.bet-type-reference-number{
  min-width:48px;
  padding-right:10px;
  border-right:1px solid rgba(255,255,255,.22);
  color:#f4f4f4;
  font-size:21px;
  font-weight:900;
  line-height:1;
}
.bet-type-label{font-size:11px;color:#f0f0f0;}
.bet-type-btn.selected{
  border-color:#ffd13b;
  background:linear-gradient(135deg,#ffe36a,#ffbd19);
  color:#17120a;
  box-shadow:0 0 12px rgba(255,193,7,.13),inset 0 0 12px rgba(255,255,255,.16);
}
.bet-type-btn.selected .bet-type-reference-number{
  color:#17120a;
  border-right-color:rgba(23,18,10,.28);
}
.bet-type-btn.selected .bet-type-label{color:#17120a;}

.rate-box{
  margin-top:8px;
  padding:9px 10px;
  border:1px solid rgba(255,193,7,.62);
  border-radius:7px;
  background:rgba(255,193,7,.035);
  color:#e6e6e6;
  font-size:8px;
}
.rate-box strong{font-size:17px;color:#ffd13b;}

.number-btn{
  min-height:46px;
  border:1px solid rgba(255,193,7,.28);
  border-radius:7px;
  background:linear-gradient(180deg,#ffffff,#f1f1f1);
  color:#111;
  font-size:18px;
  font-weight:900;
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.06),0 1px 3px rgba(0,0,0,.28);
}
.number-btn:not(.selected) span{
  color:#111 !important;
  font-size:18px !important;
  font-weight:900;
  text-shadow:none;
}
.number-btn small{color:#111 !important;font-size:9px;font-weight:900;}
.number-btn.selected{
  border-color:#ffd13b;
  background:linear-gradient(135deg,#ffe66b,#ffc51f);
  color:#111;
  box-shadow:0 0 0 1px rgba(255,193,7,.2),0 2px 7px rgba(255,193,7,.12);
}
.number-btn.selected span{color:#111 !important;font-size:18px !important;}
.number-btn.selected small{color:#111 !important;}

.patti-groups{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:7px;
  max-height:none;
  overflow:visible;
  padding:0;
}
.patti-group{
  padding:0 4px 4px;
  border:2px solid #c99512;
  border-radius:8px;
  background:#090d12;
  overflow:hidden;
  box-shadow:0 1px 4px rgba(0,0,0,.35);
}
.patti-group-title{
  margin:0 -1px 4px;
  padding:5px 4px;
  border-radius:5px 5px 3px 3px;
  background:linear-gradient(180deg,#ffd83f,#e8aa12);
  color:#111;
  font-size:12px;
  font-weight:900;
  letter-spacing:.2px;
  text-align:center;
}
.patti-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:2px;}
.patti-grid .number-btn{min-height:29px;border-radius:4px;font-size:11px;}
.patti-grid .number-btn span,
.patti-grid .number-btn:not(.selected) span,
.patti-grid .number-btn.selected span{font-size:11px !important;}
.patti-grid .number-btn small{font-size:7px;}
.patti-triple-grid{grid-template-columns:repeat(3,minmax(0,1fr));}

.amount-btn,
.amount-btn.selected{
  width:72px;
  height:48px;
  min-height:48px;
  border:1px solid #b9c4d0;
  border-radius:999px;
  background:linear-gradient(180deg,#ffffff,#dfe8f2);
  color:#111 !important;
  font-size:13px;
  font-weight:900;
  text-shadow:none;
  box-shadow:inset 0 1px 2px rgba(255,255,255,.95),0 2px 5px rgba(0,0,0,.32);
}
.amount-btn.selected{
  border-color:#f1cf61;
  background:linear-gradient(180deg,#fffdf2,#dce7f1);
  box-shadow:inset 0 1px 2px rgba(255,255,255,.98),0 0 0 2px rgba(255,193,7,.18),0 3px 7px rgba(0,0,0,.32);
}
.amount-grid{gap:8px;}

.selected-bets-panel{
  border:1px solid rgba(255,193,7,.82);
  background:#070b10;
  box-shadow:inset 0 0 14px rgba(255,193,7,.018);
}
.selected-bets-title{font-size:9px;color:#ffd13b;}
.selected-bets-list{
  max-height:355px;
  overflow-y:auto;
  overflow-x:hidden;
  padding-right:3px;
  scrollbar-width:thin;
  scrollbar-color:#c79b20 #0b1017;
}
.selected-bets-list::-webkit-scrollbar{width:5px;}
.selected-bets-list::-webkit-scrollbar-track{background:#0b1017;border-radius:8px;}
.selected-bets-list::-webkit-scrollbar-thumb{background:#c79b20;border-radius:8px;}
.selected-bet-row{
  min-height:31px;
  padding:4px 6px;
  border-radius:5px;
  background:linear-gradient(180deg,#0b121a,#080d13);
  border:1px solid #202c38;
  font-size:9px;
  font-weight:900;
}
.selected-bet-number{
  flex:0 0 46px;
  min-width:46px;
  padding:4px 5px;
  border-radius:5px;
  background:linear-gradient(135deg,#ffe66b,#ffc51f);
  color:#111 !important;
  font-size:12px;
  font-weight:900;
  line-height:1;
  text-align:center;
}
.selected-bet-row strong{
  flex:1 1 auto;
  min-width:0;
  margin-left:9px;
  color:#f4f4f4;
  font-size:10px;
  text-align:left;
}
.selected-bet-remove{
  width:24px;
  height:24px;
  margin-left:7px;
  flex:0 0 24px;
  border:1px solid rgba(255,65,65,.65);
  border-radius:6px;
  background:rgba(255,50,50,.08);
  color:#ff3e4d;
  font-size:18px;
  line-height:20px;
}

@media (max-width:390px){
  .bet-type-reference-number{min-width:43px;padding-right:8px;font-size:18px;}
  .bet-type-label{font-size:10px;}
  .number-btn{min-height:43px;}
  .number-btn:not(.selected) span,
  .number-btn.selected span{font-size:16px !important;}
  .patti-groups{gap:5px;}
  .patti-group-title{font-size:10px;padding:4px;}
  .patti-grid .number-btn{min-height:27px;}
  .patti-grid .number-btn span,
  .patti-grid .number-btn:not(.selected) span,
  .patti-grid .number-btn.selected span{font-size:10px !important;}
  .amount-btn,.amount-btn.selected{width:64px;height:46px;min-height:46px;font-size:12px;}
  .selected-bets-list{max-height:355px;}
}
`}
</style>




{/* =====================================================


LOGGED-IN CUSTOMER


===================================================== */}




{isLoggedIn ? (
  forcePasswordReset
    ? renderForcedPasswordReset()
    : userRole === "SUPER_ADMIN"
      ? renderSuperAdminArea()
      : userRole === "AGENT_ADMIN"
        ? renderAgentAdminArea()
        : renderCustomerArea()
):(


<>


{/* =================================================


    PUBLIC HEADER


================================================= */}




<header className="header">


<div className="header-inner">

<div className="brand-row">


<div className="brand-lockup">
<span className="brand-crown">♛</span>
<div>
<div className="brand"><span className="brand-light">APNA</span> MATKA</div>
<div className="brand-subtitle">
VIRTUAL USD COIN GAMES
</div>
</div>
</div>




<div className="auth-buttons">


<button


className="auth-btn"


onClick={openLogin}


>


LOGIN


</button>

<button


className="auth-btn signup"


onClick={openSignup}


>


SIGN UP


</button>


</div>


</div>




<div className="support-row">


<a
className="support-btn"
href={contactWhatsappLink || undefined}
target={contactWhatsappLink ? "_blank" : undefined}
rel={contactWhatsappLink ? "noopener noreferrer" : undefined}
aria-disabled={!contactWhatsappLink}
onClick={(e) => { if (!contactWhatsappLink) e.preventDefault(); }}
>
WhatsApp
</a>




<a
className="support-btn"
href={contactTelegramLink || undefined}
target={contactTelegramLink ? "_blank" : undefined}
rel={contactTelegramLink ? "noopener noreferrer" : undefined}
aria-disabled={!contactTelegramLink}
onClick={(e) => { if (!contactTelegramLink) e.preventDefault(); }}
>
Telegram
</a>


</div>


</div>


</header>




{/* =================================================


PUBLIC WELCOME


================================================= */}




<section className="welcome">


<h1>♛ Welcome to <span className="welcome-accent">Apna Matka</span></h1>
<p>Select a game to continue. Login is required to match in this exciting interface.</p>




<div className="today-title">


TODAY'S GAMES


</div>


</section>




{/* =================================================
PUBLIC GAME PREVIEW
================================================= */}

<main className="games">
  {renderPublicGameCards()}
</main>

{/* =================================================
PUBLIC FOOTER
================================================= */}

<footer className="footer">
  <div className="footer-responsible">♜ &nbsp; Play Responsibly &nbsp; | &nbsp; 18+ Only &nbsp; | &nbsp; Virtual USD Coin Games</div>
</footer>

{/* =================================================


LOGIN / SIGNUP MODAL


================================================= */}




{(showLogin ||


showSignup) && (


<div


className="modal-bg"


onClick={closeModal}


>


<div


className="modal"


onClick={(event) =>

 event.stopPropagation()


}


>


{/* LOGIN */}




{showLogin && (
<>
<h2>Login</h2>
<p>Login to continue to Apna Matka.</p>
<input
className="input"
type="text"
placeholder="Username or Email Address"
autoComplete="username"
value={loginIdentifier}
onChange={(event) => setLoginIdentifier(event.target.value)}
/>
<input
className="input"
type="password"
placeholder="Password"
autoComplete="current-password"
maxLength={16}
value={password}
onChange={(event) => setPassword(event.target.value)}
/>
{authMessage && <div className="otp-message">{authMessage}</div>}
{authError && <div className="otp-error">{authError}</div>}
<div className="modal-actions">
<button className="cancel" onClick={closeModal}>CANCEL</button>
<button className="continue" onClick={loginUser}>LOGIN</button>
</div>
</>
)}
{/* SIGNUP */}




{showSignup && (
<>
<h2>Create Account</h2>
<p>Create your Apna Matka account with username, email and password.</p>
<input
className="input"
type="text"
placeholder="Username"
autoComplete="username"
value={signupUsername}
onChange={(event) => setSignupUsername(event.target.value.toLowerCase())}
maxLength={50}
/>
<input
className="input"
type="text"
placeholder="Name (Optional)"
autoComplete="name"
value={name}
onChange={(event) => setName(event.target.value)}
/>
<input
className="input"
type="email"
placeholder="Email Address"
autoComplete="email"
value={email}
onChange={(event) => setEmail(event.target.value)}
/>
<input
className="input"
type="password"
placeholder="Password"
autoComplete="new-password"
maxLength={16}
value={password}
onChange={(event) => setPassword(event.target.value)}
/>
<input
className="input"
type="password"
placeholder="Confirm Password"
autoComplete="new-password"
maxLength={16}
value={confirmPassword}
onChange={(event) => setConfirmPassword(event.target.value)}
/>
<div className="otp-message">Password must be 8–16 characters.</div>
{authMessage && <div className="otp-message">{authMessage}</div>}
{authError && <div className="otp-error">{authError}</div>}
<div className="modal-actions">
<button className="cancel" onClick={closeModal}>CANCEL</button>
<button className="continue" onClick={createAccount}>CREATE ACCOUNT</button>
</div>
</>
)}
         </div>


         </div>


     )}


     </>


    )}


    </div>


);


}






































































export default App;
