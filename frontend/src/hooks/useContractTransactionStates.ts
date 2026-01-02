// Enhanced transaction loading states for contracts
// Add these to your existing useContract.ts hooks

/**
 * Example of how to enhance existing hooks with transaction loading states
 * 
 * In usePlayerRegistration():
 * 
 * const registerTransactionLoading = useTransactionLoading({
 *   enableProgressTracking: true,
 * });
 * 
 * Then update the registerUsername function:
 * 
 * const registerUsername = useCallback(async (username: string) => {
 *   registerTransactionLoading.startLoading();
 *   try {
 *     registerTransactionLoading.updateSigning();
 *     const result = await registerUsernameAsync({...});
 *     registerTransactionLoading.updateSubmitted(result);
 *     registerTransactionLoading.updateMining();
 *     registerTransactionLoading.markSuccess();
 *     return result;
 *   } catch (error) {
 *     registerTransactionLoading.markFailed(error instanceof Error ? error : new Error('Failed'));
 *     throw error;
 *   }
 * }, [registerUsernameAsync, registerTransactionLoading]);
 */

export const TRANSACTION_LOADING_INTEGRATION_EXAMPLE = true;
