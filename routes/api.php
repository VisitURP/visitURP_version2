<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SurveyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocTypeController;
use App\Http\Controllers\UservisitURPController;
use App\Http\Controllers\VisitorPController;
use App\Http\Controllers\VisitorVController;
use App\Http\Controllers\ChatbotCategorieController;
use App\Http\Controllers\ChatbotQAController;
use App\Http\Controllers\ChatBot_InquiryController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\VisitorInfoXApplicantController;
use App\Http\Controllers\VisitGroupController;
use App\Http\Controllers\AcademicInterestController;
use App\Http\Controllers\BuiltAreaController;
use App\Http\Controllers\UserVController;
use App\Http\Controllers\UserAreaVisitController;
use App\Http\Controllers\VisitVController;
use App\Http\Controllers\VisitVDetailController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\VisitorPreferenceController;
use App\Http\Controllers\UserPrivacyPreferencesController;
use App\Http\Controllers\InteractiveFeedbacksController;
use App\Http\Controllers\UbigeoController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\PublicityController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource('survey', SurveyController::class);
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/survey/get-by-slug/{survey:slug}', [SurveyController::class, 'getBySlug']);
Route::post('/survey/{survey}/answer', [SurveyController::class, 'storeAnswer']);
Route::post('/survey/{survey}/answer', [SurveyController::class, 'storeAnswer']);

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

//docType
Route::post('register-docType', [DocTypeController::class, 'store']);

Route::get('list-docTypes', [DocTypeController::class, 'index']);

Route::get('find-docType/{id}', [DocTypeController::class, 'show']);

Route::put('update-docType/{id}', [DocTypeController::class, 'update']);

Route::delete('delete-docType/{id}',[DocTypeController::class, 'destroy']);

//uservisitURP
Route::post('register-uservisitURP', [UservisitURPController::class, 'store']);

Route::get('list-uservisitURPs', [UservisitURPController::class, 'index']);

Route::get('find-uservisitURP/{id}', [UservisitURPController::class, 'show']);

Route::put('update-uservisitURP/{id}', [UservisitURPController::class, 'update']);

Route::delete('delete-uservisitURP/{id}',[UservisitURPController::class, 'destroy']);

//visitorP
Route::post('register-visitorP', [VisitorPController::class, 'store']);

Route::get('list-visitorPs', [VisitorPController::class, 'index']);

Route::get('find-visitorP/{id}', [VisitorPController::class, 'show']);

Route::put('update-visitorP/{id}', [VisitorPController::class, 'update']);

Route::delete('delete-visitorP/{id}',[VisitorPController::class, 'destroy']);

//visitGroup
Route::get('getvisit-groups', [VisitGroupController::class, 'index']);

Route::get('visit-group/{id}', [VisitGroupController::class, 'show']);

Route::post('visit-groups', [VisitGroupController::class, 'store']);

Route::put('update-visitgroups/{id}', [VisitGroupController::class, 'update']);

Route::delete('delete-visitgroup/{id}', [VisitGroupController::class, 'destroy']);

//visitorV
Route::get('list-visitorVs', [VisitorVController::class, 'index']);

Route::post('register-visitorV', [VisitorVController::class, 'store']);

Route::get('find-visitorV/{id}', [VisitorVController::class, 'show']);

Route::put('update-visitorV/{id}', [VisitorVController::class, 'update']);

Route::delete('delete-visitorV/{id}', [VisitorVController::class, 'destroy']);

//ChatBot_Category
Route::get('list-categories', [ChatbotCategorieController::class, 'index']);

Route::post('register-category', [ChatbotCategorieController::class, 'store']);

Route::get('find-category/{id}', [ChatbotCategorieController::class, 'show']);

Route::put('update-category/{id}', [ChatbotCategorieController::class, 'update']);

Route::delete('delete-category/{id}', [ChatbotCategorieController::class, 'destroy']);

//ChatBot_QA
Route::get('list-qa', [ChatbotQAController::class, 'index']);

Route::post('register-qa', [ChatbotQAController::class, 'store']);

Route::get('find-qa/{id}', [ChatbotQAController::class, 'show']);

Route::put('update-qa/{id}', [ChatbotQAController::class, 'update']);

Route::delete('delete-qa/{id}', [ChatbotQAController::class, 'destroy']);

//ChatBot_inquiry
Route::get('list-inquiry', [ChatBot_InquiryController::class, 'index']);

Route::post('register-inquiry', [ChatBot_InquiryController::class, 'store']);

Route::get('find-inquiry/{id}', [ChatBot_InquiryController::class, 'show']);

Route::put('update-inquiry/{id}', [ChatBot_InquiryController::class, 'update']);

Route::delete('delete-inquiry/{id}', [ChatBot_InquiryController::class, 'destroy']);

//applicant
Route::get('list-applicants', [ApplicantController::class, 'index']);

Route::post('register-applicant', [ApplicantController::class, 'store']);

Route::get('find-applicant/{id}', [ApplicantController::class, 'show']);

Route::put('update-applicant/{id}', [ApplicantController::class, 'update']);

Route::delete('delete-applicant/{id}', [ApplicantController::class, 'destroy']);


//visit X applicant table
Route::get('sync-visitorInfoXapplicants', [VisitorInfoXApplicantController::class, 'SyncVisitorInfoXApplicant']);

Route::get('list-visitorInfoXApplicants', [VisitorInfoXApplicantController::class, 'index']);

Route::get('find-visitorXapplicant/{id}', [VisitorInfoXApplicantController::class, 'show']);

Route::post('register-visitorXapplicant', [VisitorInfoXApplicantController::class, 'store']);

Route::put('update-visitorXapplicant/{id}', [VisitorInfoXApplicantController::class, 'update']);

Route::delete('delete-visitorXapplicant/{id}', [VisitorInfoXApplicantController::class, 'destroy']);

Route::get('total-visitorsVFromLima', [VisitorInfoXApplicantController::class, 'getVisitorsFromLima']);

Route::get('total-visitorsVBydisctictFromLima', [VisitorInfoXApplicantController::class, 'CountVisitorsByDistrictfromLima']);

Route::get('total-MostAreaVisited', [VisitorInfoXApplicantController::class, 'getMostVisitedBuiltAreas']);

Route::get('total-visitorsVByArea', [VisitorInfoXApplicantController::class, 'getVisitsByBuiltArea']);

Route::get('total-VisitsWithDetailsByBuiltArea', [VisitorInfoXApplicantController::class, 'getVisitsWithDetailsByBuiltArea']);

Route::get('details-visitorsV', [VisitorInfoXApplicantController::class, 'getVirtualVisitorsfromVisitorInfo']);

Route::get('details-visitorsP', [VisitorInfoXApplicantController::class, 'getPhysicalVisitorsFromInfo']);


//academicInterest table
Route::post('register-academicInterest', [AcademicInterestController::class, 'store']);

Route::get('list-academicInterests', [AcademicInterestController::class, 'index']);

Route::get('find-academicInterest/{id}', [AcademicInterestController::class, 'show']);

Route::put('update-academicInterest/{id}', [AcademicInterestController::class, 'update']);

Route::delete('delete-academicInterest/{id}', [AcademicInterestController::class, 'destroy']);

//builtArea table
Route::post('register-builtArea', [BuiltAreaController::class, 'store']);

Route::get('list-builtAreas', [BuiltAreaController::class, 'index']);

Route::get('find-builtArea/{id}', [BuiltAreaController::class, 'show']);

Route::put('update-builtArea/{id}', [BuiltAreaController::class, 'update']);

Route::delete('delete-builtArea/{id}', [BuiltAreaController::class, 'destroy']);


//user visitor table
Route::post('register-userV', [UserVController::class, 'store']);

Route::get('list-usersV', [UserVController::class, 'index']);

Route::get('find-userV/{id}', [UserVController::class, 'show']);

Route::put('update-userV/{id}', [UserVController::class, 'update']);

Route::delete('delete-userV/{id}', [UserVController::class, 'destroy']);


//visitV table
Route::post('register-visitV', [VisitVController::class, 'store']);

Route::get('list-visitVs', [VisitVController::class, 'index']);

Route::get('find-visitV/{id}', [VisitVController::class, 'show']);

Route::put('update-visitV/{id}', [VisitVController::class, 'update']);

Route::delete('delete-visitV/{id}', [VisitVController::class, 'destroy']);


//visitVdetail table
Route::post('register-visitVD', [VisitVDetailController::class, 'store']);

Route::get('list-visitVD', [VisitVDetailController::class, 'index']);

Route::get('find-visitVD/{id_visitVDetail}', [VisitVDetailController::class, 'show']);

Route::put('update-visitVD/{id_visitVDetail}', [VisitVDetailController::class, 'update']);

Route::delete('delete-visitVD/{id_visitVDetail}', [VisitVDetailController::class, 'destroy']);

//semester table
Route::post('register-semester', [SemesterController::class, 'store']);

Route::get('list-semester', [SemesterController::class, 'index']);

Route::get('find-semester/{id_semester}', [SemesterController::class, 'show']);

Route::put('update-semester/{id_semester}', [SemesterController::class, 'update']);

Route::delete('delete-semester/{id_semester}', [SemesterController::class, 'destroy']);

//visitorPreferences table
Route::post('register-visitorPreference', [VisitorPreferenceController::class, 'store']);

Route::get('list-visitorPreference', [VisitorPreferenceController::class, 'index']);

Route::get('find-visitorPreference/{id}', [VisitorPreferenceController::class, 'show']);

Route::put('update-visitorPreference/{id}', [VisitorPreferenceController::class, 'update']);

Route::delete('delete-visitorPreference/{id}', [VisitorPreferenceController::class, 'destroy']);

//userprivacyPreferences table
Route::post('register-UserPrivacyPreference', [UserPrivacyPreferencesController::class, 'store']);

Route::get('list-UserPrivacyPreference', [UserPrivacyPreferencesController::class, 'index']);

Route::get('find-UserPrivacyPreference/{id}', [UserPrivacyPreferencesController::class, 'show']);

Route::put('update-UserPrivacyPreference/{id}', [UserPrivacyPreferencesController::class, 'update']);

Route::delete('delete-UserPrivacyPreference/{id}', [UserPrivacyPreferencesController::class, 'destroy']);


//interactiveFeedbacks table
Route::post('register-interactiveFeedback', [InteractiveFeedbacksController::class, 'store']);

Route::get('list-interactiveFeedbacks', [InteractiveFeedbacksController::class, 'index']);

Route::get('find-interactiveFeedbacks/{id}', [InteractiveFeedbacksController::class, 'show']);

Route::put('update-interactiveFeedbacks/{id}', [InteractiveFeedbacksController::class, 'update']);

Route::delete('delete-interactiveFeedbacks/{id}', [InteractiveFeedbacksController::class, 'destroy']);

//publicity PublicityController
Route::post('register-publicity', [PublicityController::class, 'store']);

Route::get('list-publicities', [PublicityController::class, 'index']);

Route::get('find-publicity/{id}', [PublicityController::class, 'show']);

Route::put('update-publicity/{id}', [PublicityController::class, 'update']);

Route::delete('delete-publicity/{id}', [PublicityController::class, 'destroy']);

//Ubigeo
Route::get('getdepartmentS', [UbigeoController::class, 'getDepartments']);

Route::get('getprovinceS/{departmentCode}', [UbigeoController::class, 'getProvinces']);

Route::get('getdistrictS/{provinceCode}', [UbigeoController::class, 'getDistricts']);

Route::post('register-ubigeo', [UbigeoController::class, 'store']);

Route::get('list-ubigeos', [UbigeoController::class, 'index']);

Route::get('find-ubigeo/{id}', [UbigeoController::class, 'show']);

Route::put('update-ubigeo/{id}', [UbigeoController::class, 'update']);

Route::delete('delete-ubigeo/{id}', [UbigeoController::class, 'destroy']);


//Ubigeos
// Route::post('/import-ubigeos', [ImportController::class, 'importUbigeos'])->name('import.ubigeos');
Route::get('import-ubigeos', [ImportController::class, 'importUbigeos']);


//Dashboard
Route::get('total-visitors', [VisitorInfoXApplicantController::class, 'getTotalVisitors']);

Route::get('visitors/gender/{gender}', [VisitorVController::class, 'getVisitorsByGender']);

Route::get('visitorsInfo/gender/{gender}', [VisitorInfoXApplicantController::class, 'getVisitorInfosByGender']);

Route::get('visitors/admitted', [VisitorInfoXApplicantController::class, 'getAdmittedVisitors']);

Route::get('visitors/non-admitted', [VisitorInfoXApplicantController::class, 'getNonAdmittedVisitors']);

Route::get('visitors/residence/{code_ubigeo}', [VisitorInfoXApplicantController::class, 'getVisitorsByResidence']);

Route::get('academic-interests/count', [VisitorPreferenceController::class, 'getAcademicInterestCounts']);

Route::get('inquiries/{id_inquiry}', [ChatBot_InquiryController::class, 'markSpecificVisitorsAsAnswered']);

Route::get('inquiries-ToAnswer', [ChatBot_InquiryController::class, 'countInquiryNonAnswered']);

Route::get('inquiries-Answered', [ChatBot_InquiryController::class, 'countInquiryAnswered']);

Route::get('getVisitorBySemester/{semesterName}', [VisitorInfoXApplicantController::class, 'getVisitorsBySemester']);

Route::get('visitsforToday', [VisitorInfoXApplicantController::class, 'getVisitsforToday']);



//visitAll_v2
Route::get('getPreferencesByVisitorId/{id}', [VisitorPreferenceController::class, 'getPreferencesByVisitorId']);

Route::delete('deletevisitorPreference/{fk_id_visitor}/{fk_id_academicInterest}', [VisitorPreferenceController::class, 'deletePreference']);


Route::get('visitors/monthly', [VisitorPController::class, 'getMonthlyPhysicalVisitors']);

Route::get('visitors/semester/{id_semester}', [VisitorVController::class, 'getVisitorsBySemester']);


//Statistics
Route::get('total-visitorsAdmitted', [VisitorInfoXApplicantController::class, 'getVisitorsAdmitted']);
Route::get('total-visitorsAdmittedByDistrict', [VisitorInfoXApplicantController::class, 'CountApplicantsAdmittedByDistrictfromLima']);

Route::get('total-visitsByvisitorP/{id_visitor}', [VisitorInfoXApplicantController::class, 'filterVisitsByVisitorP']);
Route::get('total-visitsByvisitorV/{id_visitor}', [VisitorInfoXApplicantController::class, 'filterVisitsByVisitorV']);
Route::get('filter-visitDetailsByVisit/{id_visit}', [VisitorInfoXApplicantController::class, 'filterVisitDetailsByVisit']);




